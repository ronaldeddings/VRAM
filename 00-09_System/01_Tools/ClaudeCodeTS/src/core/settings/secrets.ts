import type { HostSecrets } from "../types/host.js";

export type SecretRefV1 = { __secretRef: string };

export function isSecretRefV1(value: unknown): value is SecretRefV1 {
  return typeof value === "object" && value !== null && "__secretRef" in value && typeof (value as any).__secretRef === "string";
}

export type SecretResolutionResult =
  | { status: "resolved"; name: string; value: string }
  | { status: "missing"; name: string }
  | { status: "error"; name: string; error: unknown };

export async function resolveSecretRefV1(ref: SecretRefV1, secrets: HostSecrets): Promise<SecretResolutionResult> {
  try {
    const value = await secrets.getSecret(ref.__secretRef);
    if (value === null) return { status: "missing", name: ref.__secretRef };
    return { status: "resolved", name: ref.__secretRef, value };
  } catch (error) {
    return { status: "error", name: ref.__secretRef, error };
  }
}

