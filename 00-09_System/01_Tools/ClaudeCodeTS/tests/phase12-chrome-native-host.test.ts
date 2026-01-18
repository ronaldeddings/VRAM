import { describe, expect, test } from "bun:test";
import { PassThrough, Writable } from "node:stream";
import { NativeHostReader, NativeHostWriter, MAX_NATIVE_MESSAGE_BYTES } from "../src/platform/desktop/chromeNativeMessaging.js";

function frameUtf8(text: string): Buffer {
  const payload = Buffer.from(text, "utf8");
  const header = Buffer.alloc(4);
  header.writeUInt32LE(payload.length, 0);
  return Buffer.concat([header, payload]);
}

describe("Phase 12: Chrome native host framing", () => {
  test("NativeHostReader reads length-prefixed JSON messages across chunks", async () => {
    const input = new PassThrough();
    const reader = new NativeHostReader(input);

    const m1 = JSON.stringify({ hello: 1 });
    const m2 = JSON.stringify({ hello: 2 });
    const buf = Buffer.concat([frameUtf8(m1), frameUtf8(m2)]);

    input.write(buf.subarray(0, 3));
    input.write(buf.subarray(3, 10));
    input.write(buf.subarray(10));

    expect(await reader.read()).toBe(m1);
    expect(await reader.read()).toBe(m2);
  });

  test("NativeHostReader returns null on invalid length", async () => {
    const input = new PassThrough();
    const reader = new NativeHostReader(input);

    const prev = console.error;
    console.error = () => {};
    const header = Buffer.alloc(4);
    header.writeUInt32LE(0, 0);
    input.end(header);

    try {
      expect(await reader.read()).toBeNull();
    } finally {
      console.error = prev;
    }
  });

  test("NativeHostWriter writes framed payloads and honors backpressure", async () => {
    const chunks: Buffer[] = [];
    class SlowWritable extends Writable {
      constructor() {
        super({ highWaterMark: 1 });
      }
      _write(chunk: any, _enc: any, cb: any) {
        chunks.push(Buffer.from(chunk));
        setTimeout(cb, 0);
      }
    }
    const out = new SlowWritable();
    const writer = new NativeHostWriter(out);

    const msg = JSON.stringify({ ok: true, bytes: MAX_NATIVE_MESSAGE_BYTES - 100 });
    await writer.writeJsonText(msg);

    const all = Buffer.concat(chunks);
    expect(all.length).toBeGreaterThan(4);
    const len = all.readUInt32LE(0);
    const payload = all.subarray(4, 4 + len).toString("utf8");
    expect(payload).toBe(msg);
  });
});
