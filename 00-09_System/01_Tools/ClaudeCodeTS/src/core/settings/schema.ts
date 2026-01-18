import type { JsonObject } from "../types/json.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { SettingsError, SettingsSource } from "./types.js";

export const LEGACY_SETTINGS_SCHEMA_URL = "https://json.schemastore.org/claude-code-settings.json";

export const SETTINGS_SCHEMA_TOOLING_REQUIREMENTS = {
  runtimeValidation: true,
  jsonSchemaExport: true,
  rnCompatible: true
} as const;

export type SettingsDocumentV1 = {
  kind: "settings_document";
  schemaVersion: typeof SCHEMA_VERSION.settingsDocument;
  settings: JsonObject;
  meta?: {
    schemaUrl?: string;
    origin?: "local" | "remote";
    updatedAtWallMs?: number;
  };
};

export type ParsedSettingsDocument = {
  document: SettingsDocumentV1 | null;
  errors: SettingsError[];
  format: "empty" | "legacy_object" | "envelope_v1" | "invalid";
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseSettingsJson(raw: string, source: SettingsSource): ParsedSettingsDocument {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return {
      document: { kind: "settings_document", schemaVersion: SCHEMA_VERSION.settingsDocument, settings: {} },
      errors: [],
      format: "empty"
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (cause) {
    return {
      document: null,
      errors: [{ kind: "parse_error", source, message: "Invalid JSON syntax", cause, severity: "error" }],
      format: "invalid"
    };
  }

  if (!isPlainObject(parsed)) {
    return {
      document: null,
      errors: [{ kind: "validation_error", source, message: "Settings JSON must be an object", severity: "error" }],
      format: "invalid"
    };
  }

  if (parsed.kind === "settings_document" && parsed.schemaVersion === SCHEMA_VERSION.settingsDocument) {
    const settings = (parsed as Record<string, unknown>).settings;
    if (!isPlainObject(settings)) {
      return {
        document: null,
        errors: [
          { kind: "validation_error", source, message: "settings_document.settings must be an object", severity: "error" }
        ],
        format: "invalid"
      };
    }
    const meta = (parsed as Record<string, unknown>).meta;
    const normalizedMeta = isPlainObject(meta) ? (meta as SettingsDocumentV1["meta"]) : undefined;
    return {
      document: {
        kind: "settings_document",
        schemaVersion: SCHEMA_VERSION.settingsDocument,
        settings: settings as JsonObject,
        ...(normalizedMeta ? { meta: normalizedMeta } : {})
      },
      errors: [],
      format: "envelope_v1"
    };
  }

  return {
    document: { kind: "settings_document", schemaVersion: SCHEMA_VERSION.settingsDocument, settings: parsed as JsonObject },
    errors: [],
    format: "legacy_object"
  };
}

export function serializeSettingsDocument(doc: SettingsDocumentV1): string {
  return `${JSON.stringify(doc, null, 2)}\n`;
}
