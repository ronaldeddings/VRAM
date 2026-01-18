import type { HookConfigError, HookMatcher, HookMatcherCompiled } from "./types.js";

function isAlphaNumOrPipe(value: string): boolean {
  return /^[a-zA-Z0-9_|]+$/.test(value);
}

function isWildcard(value: string): boolean {
  return value === "*";
}

function validateRegexPattern(value: string): string | null {
  if (value.length > 512) return "Regex matcher too long (max 512 chars)";
  if (value.includes("(?<=") || value.includes("(?<!")) return "Lookbehind regex is not portable; use literal matchers";
  return null;
}

export function compileMatcher(
  matcher: string | undefined,
  options: { source: HookMatcher["source"]; eventName: HookMatcher["eventName"]; matcherIndex: number }
): { compiled: HookMatcherCompiled; errors: HookConfigError[] } {
  const errors: HookConfigError[] = [];
  if (!matcher || matcher.trim() === "" || isWildcard(matcher.trim())) {
    return {
      compiled: { kind: "match_all", ...(matcher !== undefined ? { original: matcher } : {}) },
      errors
    };
  }

  const raw = matcher.trim();
  if (isAlphaNumOrPipe(raw)) {
    if (raw.includes("|")) {
      const parts = raw
        .split("|")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      return { compiled: { kind: "one_of", original: raw, values: parts }, errors };
    }
    return { compiled: { kind: "exact", original: raw, value: raw }, errors };
  }

  const regexIssue = validateRegexPattern(raw);
  if (regexIssue) {
    errors.push({
      kind: "validation_error",
      source: options.source,
      eventName: options.eventName,
      message: regexIssue,
      pointer: `/hooks/${options.eventName}/${options.matcherIndex}/matcher`,
      details: { matcher: raw }
    });
    return { compiled: { kind: "invalid", original: raw, error: regexIssue }, errors };
  }

  try {
    const re = new RegExp(raw);
    return { compiled: { kind: "regex", original: raw, regex: re }, errors };
  } catch (error) {
    errors.push({
      kind: "validation_error",
      source: options.source,
      eventName: options.eventName,
      message: "Invalid regex pattern in hook matcher",
      pointer: `/hooks/${options.eventName}/${options.matcherIndex}/matcher`,
      details: { matcher: raw, error: error instanceof Error ? error.message : String(error) }
    });
    return { compiled: { kind: "invalid", original: raw, error: "Invalid regex pattern" }, errors };
  }
}

export function matchesCompiledMatcher(query: string, matcher: HookMatcherCompiled): boolean {
  switch (matcher.kind) {
    case "match_all":
      return true;
    case "exact":
      return query === matcher.value;
    case "one_of":
      return matcher.values.includes(query);
    case "regex":
      return matcher.regex.test(query);
    case "invalid":
      return false;
  }
}
