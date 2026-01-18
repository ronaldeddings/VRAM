export type IdSource = {
  nextId: (prefix?: string) => string;
};

export type UuidLike = {
  randomUUID: () => string;
};

export function createMonotonicIdSource(options: { startAt?: number } = {}): IdSource {
  let counter = options.startAt ?? 0;
  return {
    nextId(prefix) {
      counter += 1;
      const body = String(counter);
      return prefix ? `${prefix}_${body}` : body;
    }
  };
}

export function createUuidIdSource(uuid: UuidLike): IdSource {
  return {
    nextId(prefix) {
      const body = uuid.randomUUID();
      return prefix ? `${prefix}_${body}` : body;
    }
  };
}

