/**
 * Email Enhancer
 *
 * Populates new email_chunks fields from original JSON files:
 * - cc_emails, bcc_emails
 * - thread_id (from references/in_reply_to)
 * - attachment_count, attachment_names
 * - is_sent_by_me (based on from_email)
 * - importance
 */

import { getConnection } from "./pg-client";

const VRAM = "/Volumes/VRAM";
const EMAIL_JSON_PATH = `${VRAM}/10-19_Work/14_Communications/14.01b_emails_json`;

// My email addresses
const MY_EMAILS = [
  "ron@hackervalley.com",
  "ronald@hackervalley.com",
  "ronaldeddings@gmail.com"
].map(e => e.toLowerCase());

interface EmailJSON {
  id: {
    message_id: string;
    index: number;
    hash: string;
  };
  headers: {
    subject: string;
    date: {
      raw: string;
      iso: string;
      timestamp: number;
    };
    from: {
      raw: string;
      name: string;
      email: string;
    };
    to: Array<{ name: string; email: string }>;
    cc?: Array<{ name: string; email: string }>;
    bcc?: Array<{ name: string; email: string }>;
    reply_to?: string;
    in_reply_to?: string;
    references?: string[];
  };
  content: {
    body: string;
    body_html?: string;
    has_html_version: boolean;
    has_plain_version: boolean;
  };
  attachments?: {
    count: number;
    files: Array<{
      filename: string;
      content_type: string;
      size_bytes: number;
    }>;
  };
  metadata: {
    labels: string[];
    content_type: string;
    is_multipart: boolean;
    spam_score?: string;
    importance?: string;
    user_agent?: string;
  };
  threading: {
    thread_topic?: string;
    thread_index?: string;
    in_reply_to?: string;
    references_count: number;
  };
}

/**
 * Check if email is from "me"
 */
function isMeEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return MY_EMAILS.includes(normalized) ||
         (normalized.endsWith("@hackervalley.com") && normalized.includes("ron"));
}

/**
 * Generate thread ID from references or in_reply_to
 */
function getThreadId(email: EmailJSON): string | null {
  // Use first reference as thread ID
  if (email.headers.references && email.headers.references.length > 0) {
    return email.headers.references[0];
  }
  // Or use in_reply_to
  if (email.headers.in_reply_to || email.threading?.in_reply_to) {
    return email.headers.in_reply_to || email.threading?.in_reply_to || null;
  }
  return null;
}

/**
 * Process email JSON files and update database
 */
export async function runEmailEnhancement(): Promise<void> {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   Email Enhancement                    ║");
  console.log("╚════════════════════════════════════════╝\n");

  const startTime = Date.now();
  const sql = getConnection();

  let processed = 0;
  let updated = 0;

  const years = ["2020", "2021", "2022", "2023", "2024", "2025"];

  for (const year of years) {
    const yearPath = `${EMAIL_JSON_PATH}/${year}`;
    const glob = new Bun.Glob("*.json");

    try {
      for await (const file of glob.scan({ cwd: yearPath, absolute: true })) {
        try {
          const content: EmailJSON = await Bun.file(file).json();
          processed++;

          // Extract email_id from file content
          const emailId = content.id?.hash || content.id?.message_id;
          if (!emailId) continue;

          // Extract CC emails
          const ccEmails = (content.headers.cc || [])
            .map(c => c.email?.toLowerCase())
            .filter(e => e && !e.includes("bcc.hubspot.com"));

          // Extract BCC emails
          const bccEmails = (content.headers.bcc || [])
            .map(c => c.email?.toLowerCase())
            .filter(e => e && !e.includes("bcc.hubspot.com"));

          // Get thread ID
          const threadId = getThreadId(content);

          // Get attachment info
          const attachmentCount = content.attachments?.count || 0;
          const attachmentNames = (content.attachments?.files || [])
            .map(f => f.filename)
            .filter(Boolean);

          // Check if sent by me
          const isSentByMe = isMeEmail(content.headers.from?.email);

          // Get importance
          const importance = content.metadata?.importance || null;

          // Update database - match by email_id (hash from JSON)
          const emailHash = content.id?.hash;
          if (!emailHash) continue;

          const result = await sql`
            UPDATE email_chunks SET
              cc_emails = ${ccEmails.length > 0 ? ccEmails : null},
              bcc_emails = ${bccEmails.length > 0 ? bccEmails : null},
              thread_id = ${threadId},
              attachment_count = ${attachmentCount},
              attachment_names = ${attachmentNames.length > 0 ? attachmentNames : null},
              importance = ${importance}
            WHERE email_id = ${emailHash}
          `;

          if (result.count && result.count > 0) {
            updated += result.count;
          }

          if (processed % 2000 === 0) {
            console.log(`   Processed ${processed} files, updated ${updated} chunks...`);
          }
        } catch {
          // Skip invalid files
        }
      }
    } catch {
      // Year directory doesn't exist
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Email enhancement complete in ${elapsed}s`);
  console.log(`   Processed: ${processed} files`);
  console.log(`   Updated: ${updated} chunks`);

  // Print stats
  const stats = await sql`
    SELECT
      COUNT(*) FILTER (WHERE is_sent_by_me = true) as sent_by_me,
      COUNT(*) FILTER (WHERE thread_id IS NOT NULL) as threaded,
      COUNT(*) FILTER (WHERE attachment_count > 0) as with_attachments,
      COUNT(*) FILTER (WHERE array_length(cc_emails, 1) > 0) as with_cc
    FROM email_chunks
  `;

  console.log("\n📈 Email Enhancement Stats:");
  console.log(`   Sent by Me: ${stats[0].sent_by_me}`);
  console.log(`   Threaded: ${stats[0].threaded}`);
  console.log(`   With Attachments: ${stats[0].with_attachments}`);
  console.log(`   With CC: ${stats[0].with_cc}`);
}

// Run if called directly
if (import.meta.main) {
  runEmailEnhancement()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });
}
