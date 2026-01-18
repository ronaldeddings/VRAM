function printHelp(): void {
  process.stdout.write(
    [
      "Usage: claude-ts mcp <command> [options]",
      "",
      "Manage MCP servers and configuration (user-facing legacy command group).",
      "",
      "Commands:",
      "  serve                          Start MCP server bridge (legacy parity)",
      "  add <name> <commandOrUrl> [args...]",
      "  add-from-claude-desktop",
      "  add-json <name> <json>",
      "  get <name>",
      "  list",
      "  remove <name>",
      "  reset-project-choices",
      "",
      "Options:",
      "  --help                          Show help",
      "",
      "Status:",
      "  Not yet implemented in the TypeScript rewrite (stub).",
      "  Internal diagnostic mode exists as `--mcp-cli` (gated)."
    ].join("\n") + "\n"
  );
}

export async function runMcpCommand(argv: string[]): Promise<number> {
  const cmd = argv[0];
  if (!cmd || cmd === "--help" || cmd === "-h") {
    printHelp();
    return 0;
  }

  // Stub for now: preserve discoverability + exit semantics.
  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return 0;
  }

  process.stderr.write(`Error: mcp ${cmd} is not implemented yet in the TypeScript rewrite.\n`);
  printHelp();
  return 1;
}

