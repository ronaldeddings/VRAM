import fs from "node:fs/promises";
import type { LogSink } from "../../core/observability/logging.js";
import type { StructuredLogRecordV1 } from "../../core/types/observability.js";

export function createNodeFileLogSink(filePath: string): LogSink {
  return {
    write: async (record: StructuredLogRecordV1) => {
      await fs.appendFile(filePath, JSON.stringify(record) + "\n", { encoding: "utf8" });
    }
  };
}

