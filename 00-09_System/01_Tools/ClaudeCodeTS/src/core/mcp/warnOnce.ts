export type WarnSink = (message: string) => void;

export class WarnOnce {
  private readonly seen = new Set<string>();

  warn(key: string, message: string, sink: WarnSink): void {
    if (this.seen.has(key)) return;
    this.seen.add(key);
    sink(message);
  }
}

