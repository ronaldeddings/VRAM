import type { HostCapabilities } from "../core/types/host.js";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { ToolRegistry, ToolRunner, createInMemoryAttachmentStore, editTool, globTool, grepTool, readTool, writeTool } from "../core/tools/index.js";
import { createMonotonicIdSource } from "../core/runtime/ids.js";
import { systemMonotonicClock } from "../core/runtime/clock.js";
import { createSettingsManager } from "../core/settings/manager.js";
import { computePermissionPolicySnapshot } from "../core/permissions/policy.js";
import { buildToolPermissionContextFromSettings, createEmptyToolPermissionContext } from "../core/permissions/context.js";
import { createLocalOnlyApprovalBroker } from "../core/permissions/broker.js";
import { createLegacyToolPermissionGate } from "../core/tools/permissionGate.js";
import { resolveHooksConfig } from "../core/hooks/sources.js";
import { createToolPipelineHooks } from "../core/hooks/toolPipeline.js";
import { computeEffectiveConfig } from "../core/settings/effectiveConfig.js";
import type { EffectiveSettingsResult } from "../core/settings/types.js";
import type { ToolPermissionCheckContext } from "../core/permissions/types.js";

type AnthropicContentBlock = { type: string; text?: string };

type AnthropicMessageResponse = {
  id?: string;
  type?: string;
  role?: string;
  content?: AnthropicContentBlock[];
  model?: string;
  stop_reason?: string | null;
};

const DEBUG = process.env.CLAUDE_TS_DEBUG === "1" || process.env.CLAUDE_TS_DEBUG === "true";
function debugLog(...args: unknown[]): void {
  if (!DEBUG) return;
  console.error(...args);
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function joinBaseUrl(base: string, path: string): string {
  if (base.endsWith("/")) base = base.slice(0, -1);
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base}${path}`;
}

type ClaudeAiOauthCredentials = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  scopes?: string[];
};

type ClaudeCodeCredentials = {
  accessToken?: string;
  claudeAiOauth?: ClaudeAiOauthCredentials;
};

type OAuthTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

type CreateApiKeyResponse = {
  api_key?: string;
  raw_key?: string;
};

function envFlagTrue(name: string): boolean {
  const v = process.env[name];
  return v === "1" || v?.toLowerCase() === "true";
}

const CLAUDE_CODE_BETA = "claude-code-20250219";
const CLAUDE_CODE_OAUTH_BETA_DEFAULTS = [
  "interleaved-thinking-2025-05-14",
  "tool-examples-2025-10-29",
  "fine-grained-tool-streaming-2025-05-14"
] as const;

function looksLikeApiKey(s: string): boolean {
  // Claude "setup-token" / Claude Code auth tokens look like `sk-ant-oat...` or `sk-ant-ort...`
  // whereas API keys are `sk-ant-...` without those substrings.
  return s.startsWith("sk-ant-") && !s.includes("oat") && !s.includes("ort");
}

function claudeCodeUserAgent(): string {
  const version = process.env.CLAUDE_TS_UPSTREAM_CLAUDE_CLI_VERSION ?? "2.0.69";
  const entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT ?? "sdk-cli";
  const agentSdk = process.env.CLAUDE_AGENT_SDK_VERSION ? `, agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}` : "";
  // Match upstream Claude Code's non-interactive UA closely.
  return `claude-cli/${version} (external, ${entrypoint}${agentSdk})`;
}

function parseAnthropicCustomHeaders(): Record<string, string> {
  const raw = process.env.ANTHROPIC_CUSTOM_HEADERS;
  if (!raw) return {};
  const out: Record<string, string> = {};
  const lines = raw.split(/\n|\r\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const m = line.match(/^\s*(.*?)\s*:\s*(.*?)\s*$/);
    if (!m) continue;
    const [, key, value] = m;
    if (!key) continue;
    out[key] = value ?? "";
  }
  return out;
}

function claudeCodeDefaultHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "x-app": "cli",
    "User-Agent": claudeCodeUserAgent(),
    ...parseAnthropicCustomHeaders()
  };

  const remoteContainerId = process.env.CLAUDE_CODE_CONTAINER_ID;
  if (remoteContainerId) headers["x-claude-remote-container-id"] = remoteContainerId;

  const remoteSessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
  if (remoteSessionId) headers["x-claude-remote-session-id"] = remoteSessionId;

  if (process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION === "1" || process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION === "true") {
    headers["x-anthropic-additional-protection"] = "true";
  }

  return headers;
}

function tryParseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function getClaudeCodeCredentials(host: HostCapabilities): Promise<ClaudeCodeCredentials | null> {
  if (host.secrets.kind !== "available") return null;
  const raw = await host.secrets.value.getSecret("claude_code/credentials_json").catch(() => null);
  if (!raw) return null;
  return tryParseJson<ClaudeCodeCredentials>(raw);
}

function oauthClientId(): string {
  return process.env.CLAUDE_TS_OAUTH_CLIENT_ID ?? "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
}

function oauthScopes(): string {
  return process.env.CLAUDE_TS_OAUTH_SCOPES ?? "user:profile user:inference user:sessions:claude_code";
}

function oauthBeta(): string {
  return process.env.CLAUDE_TS_ANTHROPIC_BETA ?? "oauth-2025-04-20";
}

function interleavedThinkingBeta(): string {
  return process.env.CLAUDE_TS_INTERLEAVED_THINKING_BETA ?? "interleaved-thinking-2025-05-14";
}

type InferenceProvider = "bedrock" | "vertex" | "foundry" | "firstParty";

function inferenceProvider(): InferenceProvider {
  if (process.env.CLAUDE_CODE_USE_BEDROCK === "1" || process.env.CLAUDE_CODE_USE_BEDROCK === "true") return "bedrock";
  if (process.env.CLAUDE_CODE_USE_VERTEX === "1" || process.env.CLAUDE_CODE_USE_VERTEX === "true") return "vertex";
  if (process.env.CLAUDE_CODE_USE_FOUNDRY === "1" || process.env.CLAUDE_CODE_USE_FOUNDRY === "true") return "foundry";
  return "firstParty";
}

function supportsInterleavedThinking(model: string): boolean {
  const provider = inferenceProvider();
  if (provider === "foundry") return true;
  if (provider === "firstParty") return !model.includes("claude-3-");
  return model.includes("claude-opus-4") || model.includes("claude-sonnet-4");
}

function claudeCodeBetasForModel(model: string, opts: { isOauth: boolean }): string[] {
  const betas: string[] = [];
  const isHaiku = model.includes("haiku");

  if (!isHaiku) betas.push(CLAUDE_CODE_BETA);
  if (opts.isOauth) betas.push(oauthBeta());
  if (opts.isOauth) betas.push(...CLAUDE_CODE_OAUTH_BETA_DEFAULTS);

  if (
    !(process.env.DISABLE_INTERLEAVED_THINKING === "1" || process.env.DISABLE_INTERLEAVED_THINKING === "true") &&
    supportsInterleavedThinking(model)
  ) {
    betas.push(interleavedThinkingBeta());
  }

  if (process.env.ANTHROPIC_BETAS && !isHaiku) {
    for (const b of process.env.ANTHROPIC_BETAS.split(",").map((s) => s.trim()).filter(Boolean)) betas.push(b);
  }

  if (inferenceProvider() === "bedrock") {
    const bedrockFiltered = new Set<string>([interleavedThinkingBeta(), "context-1m-2025-08-07"]);
    return betas.filter((b) => !bedrockFiltered.has(b));
  }

  return betas;
}

async function refreshOauthTokenIfNeeded(oauth: ClaudeAiOauthCredentials, options: { consoleBaseUrl: string }): Promise<ClaudeAiOauthCredentials> {
  const accessToken = oauth.accessToken;
  const refreshToken = oauth.refreshToken;
  const expiresAt = oauth.expiresAt;
  if (!accessToken) return oauth;
  if (!refreshToken || typeof expiresAt !== "number") return oauth;

  const now = Date.now();
  const skewMs = 30_000;
  if (now < expiresAt - skewMs) return oauth;

  const url = joinBaseUrl(options.consoleBaseUrl, "/v1/oauth/token");
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: oauthClientId()
    })
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`OAuth refresh failed (${res.status}): ${text.slice(0, 2000)}`);
  const parsed = tryParseJson<OAuthTokenResponse>(text);
  if (!parsed?.access_token) throw new Error("OAuth refresh returned no access_token");

  const nextExpiresAt = typeof parsed.expires_in === "number" ? Date.now() + parsed.expires_in * 1000 : expiresAt;
  const nextScopes = parsed.scope ? parsed.scope.split(" ").filter(Boolean) : oauth.scopes;
  return {
    accessToken: parsed.access_token,
    refreshToken: parsed.refresh_token ?? refreshToken,
    expiresAt: nextExpiresAt,
    ...(nextScopes ? { scopes: nextScopes } : {})
  };
}

async function persistUpdatedOauthCredentials(host: HostCapabilities, nextOauth: ClaudeAiOauthCredentials): Promise<void> {
  if (host.secrets.kind !== "available") return;
  if (!host.secrets.value.setSecret) return;

  const raw = await host.secrets.value.getSecret("claude_code/credentials_json").catch(() => null);
  const parsed = raw ? tryParseJson<Record<string, unknown>>(raw) : null;

  const next: Record<string, unknown> = parsed && typeof parsed === "object" ? { ...parsed } : {};
  const existingOauth = (next["claudeAiOauth"] && typeof next["claudeAiOauth"] === "object" ? (next["claudeAiOauth"] as any) : {}) as any;

  next["claudeAiOauth"] = {
    ...existingOauth,
    ...(nextOauth.accessToken ? { accessToken: nextOauth.accessToken } : {}),
    ...(nextOauth.refreshToken ? { refreshToken: nextOauth.refreshToken } : {}),
    ...(typeof nextOauth.expiresAt === "number" ? { expiresAt: nextOauth.expiresAt } : {}),
    ...(nextOauth.scopes ? { scopes: nextOauth.scopes } : {})
  };

  await host.secrets.value.setSecret("claude_code/credentials_json", JSON.stringify(next));
}

async function exchangeOauthForApiKey(accessToken: string, options: { anthropicBaseUrl: string }): Promise<string> {
  const url = joinBaseUrl(options.anthropicBaseUrl, "/api/oauth/claude_cli/create_api_key");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent": "claude-cli/2.0.26 (external, cli)",
      Authorization: `Bearer ${accessToken}`
    },
    body: null
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`API key exchange failed (${res.status}): ${text.slice(0, 2000)}`);
  const parsed = tryParseJson<CreateApiKeyResponse>(text);
  const apiKey = parsed?.api_key ?? parsed?.raw_key;
  if (!apiKey) throw new Error("API key exchange returned no api_key");
  return apiKey;
}

type PromptAuth =
  | { kind: "apiKey"; apiKey: string }
  | { kind: "authToken"; authToken: string }
  | { kind: "oauth"; accessToken: string; refreshAttempted?: boolean; refreshFailedMessage?: string };

async function resolvePromptAuth(
  host: HostCapabilities,
  options: { consoleBaseUrl: string; anthropicBaseUrl: string }
): Promise<PromptAuth> {
  const envApiKey = process.env.ANTHROPIC_API_KEY;
  if (envApiKey) return { kind: "apiKey", apiKey: envApiKey };

  const envAuthToken = process.env.ANTHROPIC_AUTH_TOKEN;
  if (envAuthToken) return { kind: "authToken", authToken: envAuthToken };

  if (host.secrets.kind === "available") {
    // Claude Code stores either an API key or a "setup-token" in Keychain under the same service name.
    // Misclassifying a setup-token as an API key produces: "only authorized for use with Claude Code".
    const stored = await host.secrets.value.getSecret("claude_code/api_key").catch(() => null);
    if (stored) return looksLikeApiKey(stored) ? { kind: "apiKey", apiKey: stored } : { kind: "authToken", authToken: stored };
  }

  const creds = await getClaudeCodeCredentials(host);
  const resolvedAccessToken =
    process.env.CLAUDE_CODE_OAUTH_TOKEN ??
    process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN ??
    creds?.accessToken ??
    creds?.claudeAiOauth?.accessToken;
  const resolvedRefreshToken = process.env.CLAUDE_CODE_SESSION_REFRESH_TOKEN ?? creds?.claudeAiOauth?.refreshToken;
  const parsedExpiresAt = process.env.CLAUDE_CODE_SESSION_EXPIRES_AT_MS ? Number.parseInt(process.env.CLAUDE_CODE_SESSION_EXPIRES_AT_MS, 10) : NaN;
  const resolvedExpiresAt = Number.isFinite(parsedExpiresAt) ? parsedExpiresAt : creds?.claudeAiOauth?.expiresAt;
  const resolvedScopes = creds?.claudeAiOauth?.scopes;

  const oauth: ClaudeAiOauthCredentials = {
    ...(resolvedAccessToken ? { accessToken: resolvedAccessToken } : {}),
    ...(resolvedRefreshToken ? { refreshToken: resolvedRefreshToken } : {}),
    ...(typeof resolvedExpiresAt === "number" ? { expiresAt: resolvedExpiresAt } : {}),
    ...(resolvedScopes ? { scopes: resolvedScopes } : {})
  };

  if (oauth.accessToken) {
    let accessToken = oauth.accessToken;
    // The TS rewrite currently prefers using the Claude Code OAuth bearer token directly for inference.
    // OAuth→API-key exchange has started requiring additional scopes (e.g. `org:create_api_key`) and can fail
    // for valid Claude Code sessions. Keep exchange/refresh gated behind env flags.
    const enableRefresh = process.env.CLAUDE_TS_ENABLE_OAUTH_REFRESH === "1" || process.env.CLAUDE_TS_ENABLE_OAUTH_REFRESH === "true";
    const enableApiKeyExchange =
      process.env.CLAUDE_TS_ENABLE_OAUTH_API_KEY_EXCHANGE === "1" || process.env.CLAUDE_TS_ENABLE_OAUTH_API_KEY_EXCHANGE === "true";

    if (enableRefresh) {
      const shouldAttemptRefresh =
        Boolean(oauth.refreshToken) && typeof oauth.expiresAt === "number" && Date.now() >= oauth.expiresAt - 30_000;
      if (shouldAttemptRefresh) {
        try {
          const freshOauth = await refreshOauthTokenIfNeeded(oauth, { consoleBaseUrl: options.consoleBaseUrl });
          if (freshOauth.accessToken) accessToken = freshOauth.accessToken;
          if (
            freshOauth.accessToken !== oauth.accessToken ||
            freshOauth.refreshToken !== oauth.refreshToken ||
            freshOauth.expiresAt !== oauth.expiresAt
          ) {
            await persistUpdatedOauthCredentials(host, freshOauth);
          }
        } catch (err) {
          debugLog("Debug: OAuth refresh failed, proceeding with existing token:", err instanceof Error ? err.message : String(err));
        }
      }
    }

    if (enableApiKeyExchange) {
      try {
        const apiKey = await exchangeOauthForApiKey(accessToken, { anthropicBaseUrl: options.anthropicBaseUrl });
        if (host.secrets.kind === "available" && host.secrets.value.setSecret) {
          await host.secrets.value.setSecret("claude_code/api_key", apiKey);
        }
        return { kind: "apiKey", apiKey };
      } catch (err) {
        debugLog("Debug: API Key exchange failed (falling back to OAuth token):", err instanceof Error ? err.message : String(err));
      }
    }

    return { kind: "oauth", accessToken };
  }

  throw new Error(
    "Missing credentials for `-p`: set ANTHROPIC_API_KEY or ANTHROPIC_AUTH_TOKEN, or ensure Claude Code credentials are available (Keychain 'Claude Code-credentials')."
  );
}

type ClaudeJsonOauthAccount = {
  accountUuid?: string;
  organizationUuid?: string;
};

type ClaudeJsonConfig = {
  oauthAccount?: ClaudeJsonOauthAccount;
  userID?: string;
};

function claudeJsonPath(): string {
  return path.join(process.env.CLAUDE_CONFIG_DIR || os.homedir(), ".claude.json");
}

async function readClaudeJsonConfig(): Promise<ClaudeJsonConfig | null> {
  try {
    const raw = await fs.readFile(claudeJsonPath(), "utf8");
    return JSON.parse(raw) as ClaudeJsonConfig;
  } catch {
    return null;
  }
}

async function writeClaudeJsonConfig(config: ClaudeJsonConfig): Promise<void> {
  await fs.writeFile(claudeJsonPath(), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

async function readClaudeJsonOauthAccount(): Promise<ClaudeJsonOauthAccount | null> {
  const cfg = await readClaudeJsonConfig();
  return cfg?.oauthAccount ?? null;
}

async function getOrCreateClaudeCodeUserIdSeed(): Promise<string> {
  const cfg = (await readClaudeJsonConfig()) ?? {};
  const existing = cfg.userID;
  if (typeof existing === "string" && existing.trim()) return existing.trim();

  const seed = crypto.randomBytes(32).toString("hex");
  await writeClaudeJsonConfig({ ...cfg, userID: seed });
  return seed;
}

function getOrCreateClaudeCodeSessionId(): string {
  const existing = process.env.CLAUDE_CODE_SESSION_ID;
  if (existing) return existing;
  const next = crypto.randomUUID();
  process.env.CLAUDE_CODE_SESSION_ID = next;
  return next;
}

async function buildClaudeCodeUserId(): Promise<string> {
  const account = await readClaudeJsonOauthAccount();
  const accountUuid = account?.accountUuid ?? "";
  const sessionId = getOrCreateClaudeCodeSessionId();
  const userIdSeed = await getOrCreateClaudeCodeUserIdSeed();
  return `user_${userIdSeed}_account_${accountUuid}_session_${sessionId}`;
}

export async function runNonInteractivePrompt(prompt: string, options: { host: HostCapabilities; model?: string; maxTokens?: number }): Promise<string> {
  const anthropicBaseUrl = process.env.CLAUDE_TS_ANTHROPIC_BASE_URL ?? "https://api.anthropic.com";
  const consoleBaseUrl = process.env.CLAUDE_TS_CONSOLE_BASE_URL ?? "https://console.anthropic.com";

  const model = options.model ?? process.env.CLAUDE_TS_MODEL ?? "claude-3-7-sonnet-20250219";
  const maxTokens =
    options.maxTokens ?? (process.env.CLAUDE_TS_MAX_TOKENS ? Number.parseInt(process.env.CLAUDE_TS_MAX_TOKENS, 10) : 256);

  if (!Number.isFinite(maxTokens) || maxTokens <= 0) throw new Error("Invalid maxTokens");

  const auth = await resolvePromptAuth(options.host, { consoleBaseUrl, anthropicBaseUrl });

  const account = await readClaudeJsonOauthAccount();
  const userId = await buildClaudeCodeUserId();
  const defaultHeaders = claudeCodeDefaultHeaders();

  debugLog("Debug: auth.kind", auth.kind);
  debugLog("Debug: account", JSON.stringify(account));

  if (auth.kind === "oauth" && account?.organizationUuid) {
    defaultHeaders["x-organization-uuid"] = account.organizationUuid;
  }

  const betas = claudeCodeBetasForModel(model, { isOauth: auth.kind === "oauth" });
  debugLog("Debug: betas", betas);
  if (betas.length > 0) {
    defaultHeaders["anthropic-beta"] = betas.join(",");
  }

  debugLog("Debug: defaultHeaders", JSON.stringify(defaultHeaders));

  const client = new Anthropic({
    baseURL: anthropicBaseUrl,
    timeout: Number.parseInt(process.env.API_TIMEOUT_MS ?? "600000", 10),
    maxRetries: Number.parseInt(process.env.CLAUDE_TS_MAX_RETRIES ?? "2", 10),
    dangerouslyAllowBrowser: true,
    defaultHeaders,
    ...(options.host.network.kind === "available" ? { fetch: options.host.network.value.fetch } : {}),
    ...(auth.kind === "apiKey"
      ? { apiKey: auth.apiKey }
      : auth.kind === "oauth"
        ? { authToken: auth.accessToken }
        : { authToken: auth.authToken })
  });

  // Use the non-beta Messages API endpoint; Claude Code behavior is controlled via `anthropic-beta` headers.
  // The SDK's `/v1/messages?beta=true` endpoint can reject Claude Code session credentials.
  const system =
    auth.kind === "oauth"
      ? [{ type: "text", text: "You are Claude Code, Anthropic's official CLI for Claude." }]
      : "You are Claude Code.";

  const enableTools = envFlagTrue("CLAUDE_TS_ENABLE_TOOLS");
  if (!enableTools) {
    const msg = (await client.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
      system,
      metadata: { user_id: userId }
    } as any)) as unknown;

    const parsed = msg as unknown as AnthropicMessageResponse;
    const blocks = Array.isArray(parsed.content) ? parsed.content : [];
    const out = blocks
      .filter((b) => b && typeof b === "object" && b.type === "text" && typeof b.text === "string")
      .map((b) => b.text ?? "")
      .join("");
    return out || "";
  }

  const clock =
    options.host.clock.kind === "available"
      ? { nowMs: () => options.host.clock.value.nowMs() }
      : systemMonotonicClock();
  const idSource = createMonotonicIdSource();

  const registry = new ToolRegistry();
  registry.registerBuiltin(readTool);
  registry.registerBuiltin(writeTool);
  registry.registerBuiltin(editTool);
  registry.registerBuiltin(globTool);
  registry.registerBuiltin(grepTool);

  const emptyEffective: EffectiveSettingsResult = { settings: {}, errors: [], enabledSources: [], perSource: {}, policyOrigin: "absent" };
  const settingsManager =
    options.host.storage.kind === "available" ? createSettingsManager(options.host, {}) : null;
  if (settingsManager) await settingsManager.initialize();
  const effective = settingsManager ? settingsManager.getEffective() : emptyEffective;
  const effectiveConfig = settingsManager
    ? settingsManager.getEffectiveConfig()
    : computeEffectiveConfig({ effectiveSettings: effective.settings, policySource: undefined, policyOrigin: effective.policyOrigin, host: options.host, env: {} });

  const policy = computePermissionPolicySnapshot(effective);
  const permissionCtx = settingsManager
    ? buildToolPermissionContextFromSettings(effective, policy).ctx
    : createEmptyToolPermissionContext();

  const checkContext: ToolPermissionCheckContext = {
    settings: effective,
    toolPermissionContext: permissionCtx,
    host: options.host,
    policy,
    sandbox: { sandboxingEnabled: false, autoAllowBashIfSandboxed: false }
  };

  const broker = createLocalOnlyApprovalBroker({
    onTool: async () => ({ decision: "allow" }),
    onNetwork: async () => ({ decision: "allow" })
  });

  const permissions = createLegacyToolPermissionGate({
    registry,
    broker,
    idSource,
    checkContext,
    ...(settingsManager ? { settingsManager } : {})
  });

  const hooksResolved = resolveHooksConfig({
    effectiveSettings: effective.settings,
    policySettings: (effective.perSource.policySettings?.settings ?? null) as any,
    effectiveConfig
  });
  const toolHooks = createToolPipelineHooks({ host: options.host, clock, idSource, hooks: hooksResolved.hooks });

  const runner = new ToolRunner(registry, { host: options.host, idSource, clock, hooks: toolHooks, maxBufferedEvents: 10_000 });
  const attachments = createInMemoryAttachmentStore({ idSource, host: options.host, defaultSensitivity: "internal" });

  const toolsForModel = registry
    .list()
    .map((t) => registry.get(t.name))
    .filter((t): t is NonNullable<typeof t> => t !== null)
    .map((t) => ({
      name: t.name,
      ...(t.description ? { description: t.description } : {}),
      input_schema: (t.inputSchema.jsonSchema as any) ?? { type: "object", properties: {}, additionalProperties: true }
    }));

  type MsgParam = { role: "user" | "assistant"; content: any };
  const messages: MsgParam[] = [{ role: "user", content: [{ type: "text", text: prompt }] }];

  const maxTurns = Number.parseInt(process.env.CLAUDE_TS_TOOL_MAX_TURNS ?? "16", 10);
  for (let turn = 0; turn < maxTurns; turn++) {
    const response = (await client.messages.create({
      model,
      max_tokens: maxTokens,
      messages,
      system,
      metadata: { user_id: userId },
      tools: toolsForModel,
      tool_choice: { type: "auto", disable_parallel_tool_use: true }
    } as any)) as any;

    messages.push({ role: "assistant", content: response.content });

    const stop = response.stop_reason as string | null | undefined;
    if (stop !== "tool_use") {
      const blocks = Array.isArray(response.content) ? response.content : [];
      const out = blocks
        .filter((b: any) => b && typeof b === "object" && b.type === "text" && typeof b.text === "string")
        .map((b: any) => b.text ?? "")
        .join("");
      return out || "";
    }

    const toolUses = (Array.isArray(response.content) ? response.content : []).filter((b: any) => b?.type === "tool_use");
    const toolResults: any[] = [];

    for (const use of toolUses) {
      const toolName = String(use.name ?? "");
      const toolUseId = String(use.id ?? "");
      const input = use.input;
      const normalizedInput =
        typeof input === "string"
          ? (() => {
              try {
                return JSON.parse(input);
              } catch {
                return input;
              }
            })()
          : input;

      const outcome = await runner.run({
        toolName,
        input: normalizedInput,
        permissions,
        attachments
      });

      if (outcome.kind === "completed") {
        const content =
          typeof outcome.result.data === "string"
            ? outcome.result.data
            : JSON.stringify(outcome.result.data, null, 2);
        toolResults.push({ type: "tool_result", tool_use_id: toolUseId, content });
      } else {
        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUseId,
          is_error: true,
          content: JSON.stringify({ code: outcome.error.code, message: outcome.error.message }, null, 2)
        });
      }
    }

    messages.push({ role: "user", content: toolResults });
  }

  throw new Error(`Tool loop exceeded max turns (${maxTurns})`);
}
