export type RnEmitterLike = {
  emit: (eventName: string, payload: unknown) => void;
};

export async function pumpAsyncIterableToEmitter<T>(
  iterable: AsyncIterable<T>,
  emitter: RnEmitterLike,
  eventName = "data"
): Promise<void> {
  for await (const item of iterable) emitter.emit(eventName, item);
}

