function printHelp(): void {
  process.stdout.write(
    [
      "Usage: claude-ts install [target] [options]",
      "",
      "Install the Claude Code native build (legacy parity command).",
      "",
      "Arguments:",
      "  target                 Optional target version/channel (legacy behavior)",
      "",
      "Options:",
      "  --force                Overwrite/replace existing installation if needed",
      "  --help                 Show help",
      "",
      "Status:",
      "  Not yet implemented in the TypeScript rewrite (stub)."
    ].join("\n") + "\n"
  );
}

export async function runInstall(argv: string[]): Promise<number> {
  let force = false;
  const positionals: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? "";
    if (a === "--help" || a === "-h") {
      printHelp();
      return 0;
    }
    if (a === "--force") {
      force = true;
      continue;
    }
    if (a.startsWith("-")) continue;
    positionals.push(a);
  }

  void force;
  void positionals;
  process.stderr.write("Error: install is not implemented yet in the TypeScript rewrite.\n");
  printHelp();
  return 1;
}

