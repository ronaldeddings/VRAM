export function normalizePortablePath(input: string): string {
  const replaced = input.replace(/\\/g, "/");
  const absolute = replaced.startsWith("/");
  const parts = replaced.split("/").filter((p) => p.length > 0 && p !== ".");
  const stack: string[] = [];
  for (const part of parts) {
    if (part === "..") {
      if (stack.length > 0 && stack[stack.length - 1] !== "..") stack.pop();
      else if (!absolute) stack.push("..");
      continue;
    }
    stack.push(part);
  }
  const joined = stack.join("/");
  return (absolute ? "/" : "") + joined;
}

export function joinPortablePath(...parts: string[]): string {
  if (parts.length === 0) return "";
  return normalizePortablePath(parts.join("/"));
}

export function basenamePortablePath(p: string): string {
  const n = normalizePortablePath(p);
  const idx = n.lastIndexOf("/");
  return idx === -1 ? n : n.slice(idx + 1);
}

export function dirnamePortablePath(p: string): string {
  const n = normalizePortablePath(p);
  const idx = n.lastIndexOf("/");
  if (idx <= 0) return n.startsWith("/") ? "/" : "";
  return n.slice(0, idx);
}
