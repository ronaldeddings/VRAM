import type { BashRedirection } from "./types.js";

export type ParseBashRedirectionsResult = {
  commandWithoutRedirections: string;
  redirections: BashRedirection[];
};

function tokenizeBashLike(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;
  let escape = false;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]!;

    if (escape) {
      current += ch;
      escape = false;
      continue;
    }

    if (quote === null && ch === "\\") {
      escape = true;
      continue;
    }

    if (quote !== null) {
      if (ch === quote) {
        quote = null;
        continue;
      }
      current += ch;
      continue;
    }

    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }

    if (/\s/.test(ch)) {
      if (current.length > 0) tokens.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  if (current.length > 0) tokens.push(current);
  return tokens;
}

function parseOperatorToken(token: string): { operator: ">" | ">>"; fd?: number; inlineTarget?: string } | null {
  if (token === ">" || token === ">>") return { operator: token };
  const match = /^(\d+)?(>>|>)(.*)$/.exec(token);
  if (!match) return null;
  const fd = match[1] ? Number.parseInt(match[1], 10) : null;
  const operator = match[2] as ">" | ">>";
  const inlineTarget = match[3] ? match[3] : null;
  return { operator, ...(fd !== null ? { fd } : {}), ...(inlineTarget !== null ? { inlineTarget } : {}) };
}

export function parseBashRedirections(command: string): ParseBashRedirectionsResult {
  const tokens = tokenizeBashLike(command);
  const keep: string[] = [];
  const redirections: BashRedirection[] = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]!;
    const op = parseOperatorToken(token);
    if (!op) {
      keep.push(token);
      continue;
    }

    const target = op.inlineTarget ?? tokens[i + 1];
    if (op.inlineTarget === undefined) i += 1;
    if (!target) continue;
    redirections.push({ operator: op.operator, target, ...(op.fd !== undefined ? { fd: op.fd } : {}) });
  }

  return { commandWithoutRedirections: keep.join(" "), redirections };
}
