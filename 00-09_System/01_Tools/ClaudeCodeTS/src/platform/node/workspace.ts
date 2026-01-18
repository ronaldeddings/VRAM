import crypto from "node:crypto";
import path from "node:path";
import type { WorkspaceId } from "../../core/types/workspace.js";
import { asWorkspaceId } from "../../core/types/workspace.js";

export function deriveWorkspaceIdFromPath(inputPath: string): WorkspaceId {
  const resolved = path.resolve(inputPath);
  const hash = crypto.createHash("sha256").update(resolved, "utf8").digest("hex").slice(0, 16);
  return asWorkspaceId(`ws_path_${hash}`);
}

