/**
 * Qwen3-VL-Embedding Client
 * High-performance embedding generation for Qwen3-VL-Embedding-8B (4096 dimensions)
 * Server runs on port 8081
 */

const EMBED_SERVER_URL = process.env.EMBED_SERVER_URL || "http://localhost:8081";
const DEFAULT_BATCH_SIZE = 8;
const EMBEDDING_DIM = 4096;

interface ServerEmbeddingResponse {
  index: number;
  embedding: number[];
}

interface HealthResponse {
  status: string;
  workers?: number;
  model?: string;
  device?: string;
}

/**
 * Check if the embedding server is healthy
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${EMBED_SERVER_URL}/health`);
  if (!response.ok) {
    throw new Error(`Embedding server unhealthy: ${response.status}`);
  }
  return response.json();
}

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${EMBED_SERVER_URL}/embedding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text })
  });

  if (!response.ok) {
    throw new Error(`Embedding generation failed: ${response.status} ${await response.text()}`);
  }

  const data: ServerEmbeddingResponse[] = await response.json();

  // Server returns array of results, we want the first one's embedding
  if (!data || data.length === 0 || !data[0].embedding) {
    throw new Error("Invalid embedding response from server");
  }

  // Handle nested array format - server may return [[...]] or [...]
  const embedding = Array.isArray(data[0].embedding[0])
    ? data[0].embedding[0] as unknown as number[]
    : data[0].embedding;

  return embedding;
}

/**
 * Generate embeddings for multiple texts in a single batch request
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  const response = await fetch(`${EMBED_SERVER_URL}/embedding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: texts })
  });

  if (!response.ok) {
    throw new Error(`Batch embedding generation failed: ${response.status} ${await response.text()}`);
  }

  const data: ServerEmbeddingResponse[] = await response.json();

  return data.map(item => {
    // Handle nested array format
    return Array.isArray(item.embedding[0])
      ? item.embedding[0] as unknown as number[]
      : item.embedding;
  });
}

/**
 * Process large arrays of texts in optimal batch sizes
 * Returns embeddings in the same order as input texts
 */
export async function generateEmbeddingsChunked(
  texts: string[],
  options: { batchSize?: number; onProgress?: (completed: number, total: number) => void } = {}
): Promise<number[][]> {
  const { batchSize = DEFAULT_BATCH_SIZE, onProgress } = options;

  const allEmbeddings: number[][] = [];
  const total = texts.length;

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const embeddings = await generateEmbeddingsBatch(batch);
    allEmbeddings.push(...embeddings);

    if (onProgress) {
      onProgress(Math.min(i + batchSize, total), total);
    }
  }

  return allEmbeddings;
}

/**
 * Generate embeddings with concurrency control
 * Useful when you want parallel batches but limited concurrency
 */
export async function generateEmbeddingsParallel(
  texts: string[],
  options: { batchSize?: number; concurrency?: number; onProgress?: (completed: number, total: number) => void } = {}
): Promise<number[][]> {
  const { batchSize = DEFAULT_BATCH_SIZE, concurrency = 2, onProgress } = options;

  // Split into batches
  const batches: string[][] = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    batches.push(texts.slice(i, i + batchSize));
  }

  const results: number[][][] = new Array(batches.length);
  let completed = 0;
  const total = texts.length;

  // Process batches with concurrency limit
  const processBatch = async (batchIndex: number) => {
    const embeddings = await generateEmbeddingsBatch(batches[batchIndex]);
    results[batchIndex] = embeddings;
    completed += batches[batchIndex].length;
    if (onProgress) {
      onProgress(completed, total);
    }
  };

  // Semaphore for concurrency control
  const queue: number[] = batches.map((_, i) => i);
  const workers: Promise<void>[] = [];

  for (let i = 0; i < Math.min(concurrency, batches.length); i++) {
    const worker = async () => {
      while (queue.length > 0) {
        const batchIndex = queue.shift();
        if (batchIndex !== undefined) {
          await processBatch(batchIndex);
        }
      }
    };
    workers.push(worker());
  }

  await Promise.all(workers);

  // Flatten results maintaining order
  return results.flat();
}

// Export constants for debugging
export { EMBED_SERVER_URL, EMBEDDING_DIM };
