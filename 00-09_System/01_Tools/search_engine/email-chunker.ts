/**
 * Email Chunking Module
 *
 * Processes Gmail JSON exports with signature removal and intelligent chunking.
 * Preserves metadata for filtered search (sender, date, labels).
 */

import { readdir } from "node:fs/promises";

const EMAIL_BASE = "/Volumes/VRAM/10-19_Work/14_Communications/14.01b_emails_json";

export interface EmailJSON {
  id: {
    message_id: string;
    index: number;
    hash: string;           // 16-char unique hash
  };
  headers: {
    subject: string;
    date: {
      raw: string;
      iso: string;
      unix: number;
    };
    from: { name: string; email: string };
    to: Array<{ name: string; email: string }>;
    cc?: Array<{ name: string; email: string }>;
    in_reply_to?: string;
    references?: string[];
  };
  content: {
    body: string;           // Plain text body
    body_html?: string;
    has_html_version: boolean;
  };
  attachments?: {
    count: number;
    files: Array<{ filename: string; content_type: string; size_bytes: number }>;
  };
  metadata: {
    labels: string[];       // Gmail labels
  };
  threading?: {
    thread_topic: string;
    references_count: number;
  };
}

export interface EmailChunk {
  text: string;
  index: number;
  emailId: string;          // 16-char hash
  emailPath: string;        // Full path to JSON file
  subject: string;
  fromName: string;
  fromEmail: string;
  toEmails: string[];
  date: string;             // ISO format
  labels: string[];
  hasAttachments: boolean;
  isReply: boolean;
}

const EMAIL_CONFIG = {
  targetSize: 1500,         // Emails tend to be shorter
  minSize: 200,             // Include short emails
  maxSize: 2000,
  overlap: 300
};

// Common signature patterns to remove
const SIGNATURE_PATTERNS = [
  /^--\s*$/m,                                    // Standard signature delimiter
  /^Sent from my iPhone/m,
  /^Sent from my iPad/m,
  /^Get Outlook for/m,
  /^\[?Disclaimer:?\]?/im,
  /^This email and any attachments/im,
  /^CONFIDENTIAL/im,
  /^_{10,}$/m,                                   // Long underscores
];

/**
 * Remove email signatures and boilerplate
 */
function removeSignature(body: string): string {
  let cleaned = body;

  for (const pattern of SIGNATURE_PATTERNS) {
    const match = cleaned.match(pattern);
    if (match && match.index !== undefined) {
      // Take content before signature
      cleaned = cleaned.slice(0, match.index).trim();
    }
  }

  return cleaned;
}

/**
 * Chunk a single email
 */
export function chunkEmail(email: EmailJSON, emailPath: string): EmailChunk[] {
  const subject = email.headers.subject || "(No Subject)";
  const body = removeSignature(email.content.body || "");

  // Combine subject + body for embedding
  const fullText = `Subject: ${subject}\n\n${body}`.trim();

  // Short emails don't need chunking
  if (fullText.length <= EMAIL_CONFIG.maxSize) {
    return [{
      text: fullText,
      index: 0,
      emailId: email.id.hash,
      emailPath: emailPath,
      subject: subject,
      fromName: email.headers.from?.name || "",
      fromEmail: email.headers.from?.email || "",
      toEmails: email.headers.to?.map(t => t.email) || [],
      date: email.headers.date?.iso || new Date().toISOString(),
      labels: email.metadata?.labels || [],
      hasAttachments: (email.attachments?.count || 0) > 0,
      isReply: !!email.headers.in_reply_to
    }];
  }

  // Long emails need chunking
  const chunks: EmailChunk[] = [];
  let start = 0;

  while (start < fullText.length) {
    let end = Math.min(start + EMAIL_CONFIG.targetSize, fullText.length);

    // Try to break at paragraph boundary
    if (end < fullText.length) {
      const nextPara = fullText.indexOf("\n\n", end - 200);
      if (nextPara !== -1 && nextPara < end + 200) {
        end = nextPara + 2;
      }
    }

    const chunkText = fullText.slice(start, end).trim();

    if (chunkText.length >= EMAIL_CONFIG.minSize) {
      chunks.push({
        text: chunkText,
        index: chunks.length,
        emailId: email.id.hash,
        emailPath: emailPath,
        subject: subject,
        fromName: email.headers.from?.name || "",
        fromEmail: email.headers.from?.email || "",
        toEmails: email.headers.to?.map(t => t.email) || [],
        date: email.headers.date?.iso || new Date().toISOString(),
        labels: email.metadata?.labels || [],
        hasAttachments: (email.attachments?.count || 0) > 0,
        isReply: !!email.headers.in_reply_to
      });
    }

    start = end - EMAIL_CONFIG.overlap;
    if (start >= fullText.length - EMAIL_CONFIG.overlap) break;
  }

  return chunks;
}

/**
 * Iterate through all emails by year
 * Structure: {year}/{email}.json directly in year folder
 */
export async function* iterateEmails(): AsyncGenerator<{ path: string; email: EmailJSON }> {
  // Start from 2025 to index newest first, then backfill older years
  const years = ["2025", "2026", "2024", "2023", "2022", "2021", "2020"];

  for (const year of years) {
    const yearPath = `${EMAIL_BASE}/${year}`;

    try {
      const files = await readdir(yearPath);
      const jsonFiles = files.filter(f => f.endsWith(".json"));

      for (const jsonFile of jsonFiles) {
        const fullPath = `${yearPath}/${jsonFile}`;
        try {
          const file = Bun.file(fullPath);
          const email = await file.json() as EmailJSON;
          yield { path: fullPath, email };
        } catch (err) {
          console.error(`Failed to parse: ${fullPath}`);
        }
      }
    } catch {
      // Year folder might not exist
      console.log(`No emails for year: ${year}`);
    }
  }
}

/**
 * Count total emails for progress reporting
 */
export async function countEmails(): Promise<number> {
  let count = 0;
  const years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

  for (const year of years) {
    const yearPath = `${EMAIL_BASE}/${year}`;
    try {
      const files = await readdir(yearPath);
      const jsonFiles = files.filter(f => f.endsWith(".json"));
      count += jsonFiles.length;
    } catch {
      // Year folder might not exist
    }
  }

  return count;
}
