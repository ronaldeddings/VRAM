// Test Qwen3-VL-Embedding parallel performance
const EMBED_URL = "http://localhost:8081";

interface EmbeddingResponse {
  embeddings: number[][];
  dimensions: number;
  processing_time_ms: number;
}

async function generateEmbeddings(texts: string[]): Promise<EmbeddingResponse> {
  const response = await fetch(`${EMBED_URL}/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts, normalize: true, output_dim: 4096 })
  });

  if (!response.ok) {
    throw new Error(`Failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

// Test texts
const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Machine learning is transforming every industry.",
  "TypeScript provides type safety for JavaScript.",
  "Semantic search uses embeddings for similarity.",
  "The weather is beautiful today in San Francisco.",
  "Neural networks learn patterns from data.",
  "Bun is a fast JavaScript runtime.",
  "Database indexing improves query performance.",
];

console.log("Testing Qwen3-VL-Embedding server...\n");

// Test sequential (one at a time)
console.log("Sequential processing (8 individual requests)...");
let start = performance.now();
for (const text of texts) {
  await generateEmbeddings([text]);
}
const sequentialTime = performance.now() - start;
console.log(`Sequential: ${sequentialTime.toFixed(0)}ms (${(sequentialTime / 8).toFixed(0)}ms/text)\n`);

// Test batch (all at once)
console.log("Batch processing (1 request with 8 texts)...");
start = performance.now();
const result = await generateEmbeddings(texts);
const batchTime = performance.now() - start;
console.log(`Batch: ${batchTime.toFixed(0)}ms (${(batchTime / 8).toFixed(0)}ms/text)`);
console.log(`Server processing time: ${result.processing_time_ms.toFixed(0)}ms\n`);

// Test parallel (concurrent requests)
console.log("Parallel processing (8 concurrent requests)...");
start = performance.now();
const parallelResults = await Promise.all(texts.map(t => generateEmbeddings([t])));
const parallelTime = performance.now() - start;
console.log(`Parallel: ${parallelTime.toFixed(0)}ms\n`);

console.log(`Speedup batch vs sequential: ${(sequentialTime / batchTime).toFixed(2)}x`);
console.log(`Speedup parallel vs sequential: ${(sequentialTime / parallelTime).toFixed(2)}x`);
console.log(`\nEmbedding dimensions: ${result.dimensions}`);
console.log(`First embedding sample: [${result.embeddings[0].slice(0, 5).map(n => n.toFixed(4)).join(", ")}...]`);
