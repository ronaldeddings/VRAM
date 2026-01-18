import type { Readable, Writable } from "node:stream";

export const MAX_NATIVE_MESSAGE_BYTES = 1_048_576;

export function nativeHostLog(message: string, ...args: unknown[]): void {
  // Matches legacy bundle prefix.
  // eslint-disable-next-line no-console
  console.error(`[Claude Chrome Native Host] ${message}`, ...args);
}

export class NativeHostReader {
  private buffer = Buffer.alloc(0);
  private pendingResolve: ((value: string | null) => void) | null = null;
  private closed = false;
  private readonly onData: (chunk: Buffer) => void;
  private readonly onEnd: () => void;
  private readonly onError: () => void;

  constructor(stream: Readable) {
    this.onData = (chunk) => {
      if (this.closed) return;
      this.buffer = Buffer.concat([this.buffer, chunk]);
      this.tryProcessMessage();
    };
    this.onEnd = () => this.close();
    this.onError = () => this.close();

    stream.on("data", this.onData);
    stream.on("end", this.onEnd);
    stream.on("error", this.onError);
  }

  private close(): void {
    if (this.closed) return;
    this.closed = true;
    if (this.pendingResolve) {
      this.pendingResolve(null);
      this.pendingResolve = null;
    }
  }

  private tryProcessMessage(): void {
    if (!this.pendingResolve) return;
    if (this.buffer.length < 4) return;

    const len = this.buffer.readUInt32LE(0);
    if (len === 0 || len > MAX_NATIVE_MESSAGE_BYTES) {
      nativeHostLog(`Invalid message length: ${len}`);
      this.close();
      return;
    }
    if (this.buffer.length < 4 + len) return;

    const payload = this.buffer.subarray(4, 4 + len);
    this.buffer = this.buffer.subarray(4 + len);
    const text = payload.toString("utf-8");
    this.pendingResolve(text);
    this.pendingResolve = null;
  }

  async read(): Promise<string | null> {
    if (this.closed) return null;

    if (this.buffer.length >= 4) {
      const len = this.buffer.readUInt32LE(0);
      if (len > 0 && len <= MAX_NATIVE_MESSAGE_BYTES && this.buffer.length >= 4 + len) {
        const payload = this.buffer.subarray(4, 4 + len);
        this.buffer = this.buffer.subarray(4 + len);
        return payload.toString("utf-8");
      }
    }

    return await new Promise((resolve) => {
      this.pendingResolve = resolve;
      this.tryProcessMessage();
    });
  }
}

export class NativeHostWriter {
  private readonly stream: Writable;

  constructor(stream: Writable) {
    this.stream = stream;
  }

  async writeJsonText(jsonText: string): Promise<void> {
    const payload = Buffer.from(jsonText, "utf8");
    if (payload.length === 0 || payload.length > MAX_NATIVE_MESSAGE_BYTES) {
      throw new Error(`Invalid native host message byte length: ${payload.length}`);
    }
    const header = Buffer.alloc(4);
    header.writeUInt32LE(payload.length, 0);
    const frame = Buffer.concat([header, payload]);

    const ok = this.stream.write(frame);
    if (ok) return;
    await new Promise<void>((resolve, reject) => {
      const onError = (err: unknown) => reject(err);
      const onDrain = () => {
        this.stream.off("error", onError);
        resolve();
      };
      this.stream.once("error", onError);
      this.stream.once("drain", onDrain);
    });
  }
}

export type NativeHostEnvelopeV1 =
  | {
      kind: "native_host_envelope";
      schemaVersion: 1;
      type: "event";
      channel: string;
      payload: unknown;
    }
  | {
      kind: "native_host_envelope";
      schemaVersion: 1;
      type: "request";
      requestId: string;
      channel: string;
      payload: unknown;
    }
  | {
      kind: "native_host_envelope";
      schemaVersion: 1;
      type: "response";
      requestId: string;
      ok: boolean;
      payload?: unknown;
      error?: { code: string; message: string; details?: unknown };
    }
  | {
      kind: "native_host_envelope";
      schemaVersion: 1;
      type: "cancel";
      requestId: string;
      reason?: string;
    };

export function stringifyNativeHostEnvelopeV1(envelope: NativeHostEnvelopeV1): string {
  return JSON.stringify(envelope);
}

