function printHelp(): void {
  process.stdout.write(
    [
      "Usage: claude-ts update [options]",
      "",
      "Check for updates and install if available (legacy parity command).",
      "",
      "Options:",
      "  --help                 Show help",
      "",
      "Status:",
      "  Not yet implemented in the TypeScript rewrite (stub)."
    ].join("\n") + "\n"
  );
}

export async function runUpdate(argv: string[]): Promise<number> {
  for (const a of argv) {
    if (a === "--help" || a === "-h") {
      printHelp();
      return 0;
    }
  }
  process.stderr.write("Error: update is not implemented yet in the TypeScript rewrite.\n");
  printHelp();
  return 1;
}

