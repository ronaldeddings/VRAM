function printHelp(): void {
  process.stdout.write(
    [
      "Usage: claude-ts setup-token [options]",
      "",
      "Interactive token setup for Claude Code credentials (legacy parity command).",
      "",
      "Options:",
      "  --help                 Show help",
      "",
      "Status:",
      "  Not yet implemented in the TypeScript rewrite (stub).",
      "  Use `CLAUDE_CODE_SESSION_ACCESS_TOKEN` / Keychain credentials for `-p` today."
    ].join("\n") + "\n"
  );
}

export async function runSetupToken(argv: string[]): Promise<number> {
  for (const a of argv) {
    if (a === "--help" || a === "-h") {
      printHelp();
      return 0;
    }
  }
  process.stderr.write("Error: setup-token is not implemented yet in the TypeScript rewrite.\n");
  printHelp();
  return 1;
}

