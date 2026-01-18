export type WorkspaceId = string & { readonly __brand: "WorkspaceId" };

export type WorkspaceKind = "path" | "remote" | "profile";

export type WorkspaceTrust = {
  trusted: boolean;
  grantedAtMs?: number;
  revokedAtMs?: number;
  reason?: string;
};

export type WorkspaceDescriptor = {
  id: WorkspaceId;
  kind: WorkspaceKind;
  displayName: string;
  trust?: WorkspaceTrust;
  path?: string;
  repo?: { url: string; branch?: string };
};

export function asWorkspaceId(value: string): WorkspaceId {
  return value as WorkspaceId;
}

