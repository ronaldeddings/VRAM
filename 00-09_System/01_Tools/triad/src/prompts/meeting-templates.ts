// Meeting Output Templates
// Structured templates for meeting analysis outputs

import { config } from "../utils/config";
import { logger } from "../utils/logger";

export interface MeetingOutputTemplate {
  type: "internal" | "client" | "sales" | "podcast" | "general";
  sections: TemplateSection[];
  formatting: OutputFormatting;
}

export interface TemplateSection {
  name: string;
  required: boolean;
  maxLength: number;
  format: "list" | "paragraph" | "table" | "kv";
  prefix?: string;
}

export interface OutputFormatting {
  useMarkdown: boolean;
  includeTimestamps: boolean;
  includeConfidence: boolean;
  maxTotalLength: number;
}

class MeetingTemplates {
  private templates: Map<string, MeetingOutputTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Internal team meeting template
    this.templates.set("internal", {
      type: "internal",
      sections: [
        { name: "Team Health Summary", required: true, maxLength: 200, format: "paragraph" },
        { name: "Key Decisions", required: true, maxLength: 500, format: "list", prefix: "✓" },
        { name: "Action Items", required: true, maxLength: 500, format: "list", prefix: "[ACTION]" },
        { name: "Blockers", required: false, maxLength: 300, format: "list", prefix: "🚧" },
        { name: "Workload Concerns", required: false, maxLength: 300, format: "list", prefix: "⚠️" },
        { name: "Process Improvements", required: false, maxLength: 300, format: "list", prefix: "💡" },
        { name: "Follow-up Required", required: true, maxLength: 200, format: "list" },
      ],
      formatting: {
        useMarkdown: true,
        includeTimestamps: true,
        includeConfidence: true,
        maxTotalLength: 3000,
      },
    });

    // Client meeting template
    this.templates.set("client", {
      type: "client",
      sections: [
        { name: "Relationship Summary", required: true, maxLength: 200, format: "paragraph" },
        { name: "Client Sentiment", required: true, maxLength: 150, format: "kv" },
        { name: "Key Discussion Points", required: true, maxLength: 500, format: "list" },
        { name: "Commitments Made", required: true, maxLength: 300, format: "list", prefix: "📋" },
        { name: "Client Concerns", required: false, maxLength: 300, format: "list", prefix: "[CLIENT RISK]" },
        { name: "Opportunities", required: false, maxLength: 300, format: "list", prefix: "[CLIENT OPPORTUNITY]" },
        { name: "Follow-up Actions", required: true, maxLength: 300, format: "list", prefix: "→" },
        { name: "Next Steps", required: true, maxLength: 200, format: "list" },
      ],
      formatting: {
        useMarkdown: true,
        includeTimestamps: true,
        includeConfidence: true,
        maxTotalLength: 3500,
      },
    });

    // Sales/discovery meeting template
    this.templates.set("sales", {
      type: "sales",
      sections: [
        { name: "Deal Summary", required: true, maxLength: 200, format: "paragraph" },
        { name: "BANT Assessment", required: true, maxLength: 400, format: "kv" },
        { name: "Stage Recommendation", required: true, maxLength: 100, format: "kv" },
        { name: "Buying Signals", required: true, maxLength: 300, format: "list", prefix: "[BUYING SIGNAL]" },
        { name: "Objections", required: false, maxLength: 300, format: "list", prefix: "[DEAL RISK]" },
        { name: "Competitive Intel", required: false, maxLength: 200, format: "list" },
        { name: "Next Steps", required: true, maxLength: 300, format: "list", prefix: "[SALES ACTION]" },
        { name: "Deal Probability", required: true, maxLength: 100, format: "kv" },
      ],
      formatting: {
        useMarkdown: true,
        includeTimestamps: false,
        includeConfidence: true,
        maxTotalLength: 3000,
      },
    });

    // Podcast recording template
    this.templates.set("podcast", {
      type: "podcast",
      sections: [
        { name: "Episode Summary", required: true, maxLength: 300, format: "paragraph" },
        { name: "Key Topics", required: true, maxLength: 300, format: "list" },
        { name: "Quotable Moments", required: true, maxLength: 500, format: "list", prefix: "[CLIP]" },
        { name: "Guest Performance", required: true, maxLength: 200, format: "kv" },
        { name: "Marketing Angles", required: false, maxLength: 300, format: "list", prefix: "[PROMO]" },
        { name: "Editing Notes", required: false, maxLength: 300, format: "list", prefix: "[EDIT]" },
        { name: "Content Quality Score", required: true, maxLength: 100, format: "kv" },
        { name: "Audience Takeaways", required: true, maxLength: 300, format: "list" },
      ],
      formatting: {
        useMarkdown: true,
        includeTimestamps: true,
        includeConfidence: false,
        maxTotalLength: 3500,
      },
    });

    // General meeting template
    this.templates.set("general", {
      type: "general",
      sections: [
        { name: "Meeting Summary", required: true, maxLength: 300, format: "paragraph" },
        { name: "Classification", required: true, maxLength: 100, format: "kv" },
        { name: "Key Outcomes", required: true, maxLength: 400, format: "list" },
        { name: "Action Items", required: true, maxLength: 400, format: "list", prefix: "[ACTION]" },
        { name: "Risks/Concerns", required: false, maxLength: 300, format: "list", prefix: "[RISK]" },
        { name: "Follow-up Needed", required: true, maxLength: 200, format: "list" },
      ],
      formatting: {
        useMarkdown: true,
        includeTimestamps: true,
        includeConfidence: true,
        maxTotalLength: 2500,
      },
    });
  }

  /**
   * Get template for meeting type
   */
  getTemplate(type: string): MeetingOutputTemplate {
    return this.templates.get(type) || this.templates.get("general")!;
  }

  /**
   * Format output according to template
   */
  formatOutput(
    type: string,
    content: Record<string, string | string[]>,
    metadata?: { confidence?: number; timestamp?: string }
  ): string {
    const template = this.getTemplate(type);
    const lines: string[] = [];

    // Header
    lines.push(`# Meeting Analysis: ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (metadata?.timestamp) {
      lines.push(`*Generated: ${metadata.timestamp}*`);
    }
    lines.push("");

    // Process each section
    for (const section of template.sections) {
      const sectionContent = content[section.name];

      if (!sectionContent && section.required) {
        continue; // Skip empty required sections
      }

      if (!sectionContent) {
        continue; // Skip empty optional sections
      }

      lines.push(`## ${section.name}`);

      if (section.format === "list" && Array.isArray(sectionContent)) {
        for (const item of sectionContent.slice(0, 10)) {
          const prefix = section.prefix ? `${section.prefix} ` : "- ";
          lines.push(`${prefix}${item}`);
        }
      } else if (section.format === "kv" && typeof sectionContent === "object") {
        const kvContent = sectionContent as Record<string, string>;
        for (const [key, value] of Object.entries(kvContent)) {
          lines.push(`- **${key}**: ${value}`);
        }
      } else if (section.format === "paragraph" && typeof sectionContent === "string") {
        lines.push(sectionContent.substring(0, section.maxLength));
      } else if (typeof sectionContent === "string") {
        lines.push(sectionContent.substring(0, section.maxLength));
      }

      lines.push("");
    }

    // Footer with confidence
    if (template.formatting.includeConfidence && metadata?.confidence !== undefined) {
      lines.push("---");
      lines.push(`*Confidence: ${(metadata.confidence * 100).toFixed(0)}%*`);
    }

    // Truncate to max length
    let output = lines.join("\n");
    if (output.length > template.formatting.maxTotalLength) {
      output = output.substring(0, template.formatting.maxTotalLength - 3) + "...";
    }

    return output;
  }

  /**
   * Generate structured JSON output
   */
  generateStructuredOutput(
    type: string,
    content: Record<string, string | string[]>,
    metadata?: { confidence?: number; timestamp?: string; meetingId?: string }
  ): object {
    const template = this.getTemplate(type);

    return {
      meetingType: type,
      timestamp: metadata?.timestamp || new Date().toISOString(),
      meetingId: metadata?.meetingId,
      confidence: metadata?.confidence,
      sections: template.sections.map((section) => ({
        name: section.name,
        required: section.required,
        content: content[section.name] || null,
      })).filter(s => s.content !== null),
      formatting: template.formatting,
    };
  }

  /**
   * Validate output against template
   */
  validateOutput(type: string, content: Record<string, string | string[]>): {
    valid: boolean;
    missing: string[];
    warnings: string[];
  } {
    const template = this.getTemplate(type);
    const missing: string[] = [];
    const warnings: string[] = [];

    for (const section of template.sections) {
      const sectionContent = content[section.name];

      if (section.required && !sectionContent) {
        missing.push(section.name);
      }

      if (sectionContent) {
        if (Array.isArray(sectionContent) && sectionContent.length === 0) {
          warnings.push(`${section.name} is empty`);
        } else if (typeof sectionContent === "string" && sectionContent.length < 10) {
          warnings.push(`${section.name} may be too brief`);
        }
      }
    }

    return {
      valid: missing.length === 0,
      missing,
      warnings,
    };
  }

  /**
   * Get all available templates
   */
  getAllTemplates(): MeetingOutputTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template section names
   */
  getSectionNames(type: string): string[] {
    const template = this.getTemplate(type);
    return template.sections.map(s => s.name);
  }
}

export const meetingTemplates = new MeetingTemplates();
