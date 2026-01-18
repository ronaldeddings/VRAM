function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export type Sampler = {
  shouldSample: (key: string, rate: number) => boolean;
};

export function createDeterministicSampler(seed: string): Sampler {
  const seedHash = fnv1a32(seed);
  return {
    shouldSample: (key, rate) => {
      const r = Number.isFinite(rate) ? Math.max(0, Math.min(1, rate)) : 0;
      if (r <= 0) return false;
      if (r >= 1) return true;
      const h = fnv1a32(`${seedHash}:${key}`);
      const unit = h / 0xffffffff;
      return unit < r;
    }
  };
}

