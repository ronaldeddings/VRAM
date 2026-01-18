import { Readable } from "node:stream";

export function asyncIterableToNodeReadable<T>(iterable: AsyncIterable<T>): Readable {
  return Readable.from(iterable as any);
}

export async function* nodeReadableToAsyncIterable<T = unknown>(stream: Readable): AsyncGenerator<T> {
  for await (const chunk of stream as any as AsyncIterable<T>) yield chunk;
}

