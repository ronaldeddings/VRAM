function printHelp(): void {
  process.stdout.write(
    [
      "Usage: claude-ts plugin <command> [options]",
      "",
      "Manage Claude Code plugins and marketplace sources (user-facing legacy command group).",
      "",
      "Commands:",
      "  validate <path>",
      "  install <plugin>                 (alias: i)",
      "  uninstall <plugin>               (alias: remove)",
      "  enable <plugin>",
      "  disable <plugin>",
      "  update <plugin>",
      "  marketplace <command> [options]",
      "",
      "Marketplace commands:",
      "  marketplace add <source>",
      "  marketplace list",
      "  marketplace remove <name>        (alias: rm)",
      "  marketplace update [name]",
      "",
      "Options:",
      "  --help                          Show help",
      "",
      "Status:",
      "  Not yet implemented in the TypeScript rewrite (stub)."
    ].join("\n") + "\n"
  );
}

export async function runPluginCommand(argv: string[]): Promise<number> {
  const cmd = argv[0];
  if (!cmd || cmd === "--help" || cmd === "-h") {
    printHelp();
    return 0;
  }

  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return 0;
  }

  process.stderr.write(`Error: plugin ${cmd} is not implemented yet in the TypeScript rewrite.\n`);
  printHelp();
  return 1;
}

