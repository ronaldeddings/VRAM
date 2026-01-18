import readline from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createEngine } from "../../core/engine/createEngine.js";
import { createNodeHostCapabilities } from "../../platform/node/host.js";
import { CliAdapter } from "./adapter.js";

export async function runNodeCli(argv: string[] = process.argv.slice(2)): Promise<number> {
  void argv;
  const host = createNodeHostCapabilities({ enableKeychain: true });
  const engine = createEngine({ host });
  const adapter = new CliAdapter(engine);

  const render = () => {
    const lines = adapter.getFrameLines();
    process.stdout.write(lines.join("\n") + "\n");
  };

  await adapter.start();
  render();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  readline.emitKeypressEvents(process.stdin, rl);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  const shutdown = async (reason: string) => {
    try {
      rl.close();
    } catch {
      // ignore
    }
    try {
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
    } catch {
      // ignore
    }
    await adapter.stop(reason);
  };

  process.on("SIGINT", () => {
    void shutdown("sigint").then(() => process.exit(0));
  });

  process.stdin.on("keypress", (_str, key: { name?: string; ctrl?: boolean } | undefined) => {
    if (!key) return;
    const apply = (hk: Parameters<typeof adapter.handleHotkey>[0]) => {
      void adapter.handleHotkey(hk).then(() => render());
    };
    if (key.ctrl && key.name === "o") {
      apply("ctrl+o");
      return;
    }
    if (key.name === "escape") {
      apply("esc");
      return;
    }
    if (key.ctrl && key.name === "c") {
      apply("ctrl+c");
      return;
    }
    if (key.ctrl && key.name === "e") {
      apply("ctrl+e");
    }
  });

  rl.on("line", (line) => {
    void adapter.sendText(line).then(() => render());
  });

  return await new Promise<number>((resolve) => {
    rl.on("close", () => {
      void shutdown("stdin-closed").then(() => resolve(0));
    });
  });
}

function isDirectRun(): boolean {
  const bunMain = (import.meta as unknown as { main?: boolean }).main;
  if (typeof bunMain === "boolean") return bunMain;
  try {
    const selfPath = fileURLToPath(import.meta.url);
    const argv1 = process.argv[1] ? path.resolve(process.argv[1]) : "";
    return argv1 === selfPath;
  } catch {
    return false;
  }
}

if (isDirectRun()) {
  runNodeCli()
    .then((code) => process.exit(code))
    .catch((err) => {
      process.stderr.write(String(err) + "\n");
      process.exit(1);
    });
}
