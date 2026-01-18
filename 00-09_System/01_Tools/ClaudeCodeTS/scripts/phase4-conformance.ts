import { buildCapabilityComplianceReport, createCapabilityView } from "../src/core/capabilities/index.js";
import { unavailableCapability } from "../src/core/types/host.js";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

async function main(): Promise<void> {
  const host = createNodeHostCapabilities({ enableKeychain: false });

  const minimalMobileSafe = {
    ...host,
    filesystem: unavailableCapability({ kind: "unsupported", message: "mobile-safe profile" }),
    localEndpoint: unavailableCapability({ kind: "unsupported", message: "mobile-safe profile" }),
    ipc: unavailableCapability({ kind: "unsupported", message: "mobile-safe profile" }),
    process: unavailableCapability({ kind: "unsupported", message: "mobile-safe profile" })
  };

  const report = buildCapabilityComplianceReport(minimalMobileSafe);
  assert(report.missingRequired.length === 0, `Missing required capabilities: ${report.missingRequired.join(", ")}`);

  const view = createCapabilityView(
    minimalMobileSafe,
    ["clock", "random", "storage", "secrets", "network", "lifecycle"],
    { policyId: "conformance" }
  );
  const viewReport = buildCapabilityComplianceReport(view);
  assert(
    viewReport.missingRequired.length === 0,
    `Capability view unexpectedly missing required: ${viewReport.missingRequired.join(", ")}`
  );
}

await main();

