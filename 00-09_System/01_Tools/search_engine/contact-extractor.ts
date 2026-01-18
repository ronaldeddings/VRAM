/**
 * Contact & Company Extractor
 *
 * Extracts contacts and companies from:
 * - Email JSON files (from, to, cc, bcc)
 * - Slack JSON files (user_profile)
 * - Transcript JSON files (participants)
 *
 * Populates: contacts, companies tables
 * Links: email_chunks.from_contact_id, slack user IDs
 */

import { getConnection } from "./pg-client";

const VRAM = "/Volumes/VRAM";
const EMAIL_JSON_PATH = `${VRAM}/10-19_Work/14_Communications/14.01b_emails_json`;
const SLACK_JSON_PATH = `${VRAM}/10-19_Work/14_Communications/14.02_slack/json`;
const TRANSCRIPT_PATH = `${VRAM}/Backup/meetings/fathom_transcripts`;

// My email addresses (for is_sent_by_me detection)
const MY_EMAILS = [
  "ron@hackervalley.com",
  "ronald@hackervalley.com",
  "ronaldeddings@gmail.com"
].map(e => e.toLowerCase());

const MY_DOMAINS = ["hackervalley.com"];

interface ExtractedContact {
  name: string;
  email: string;
  company?: string;
  domain?: string;
  slackUserId?: string;
  role?: string;
  source: "email" | "slack" | "transcript";
}

interface ExtractedCompany {
  name: string;
  domain: string;
  source: string;
}

// Track extracted data
const contacts = new Map<string, ExtractedContact>();
const companies = new Map<string, ExtractedCompany>();
const slackUserMap = new Map<string, { name: string; email?: string }>();

/**
 * Extract domain from email address
 */
function extractDomain(email: string): string | null {
  if (!email || !email.includes("@")) return null;
  return email.split("@")[1].toLowerCase();
}

/**
 * Clean and normalize email
 */
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Determine if email is from "me"
 */
function isMeEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return MY_EMAILS.includes(normalized) ||
         MY_DOMAINS.some(d => normalized.endsWith(`@${d}`) && normalized.includes("ron"));
}

/**
 * Add contact to tracking map
 */
function addContact(contact: ExtractedContact): void {
  if (!contact.email) return;

  const key = normalizeEmail(contact.email);
  const existing = contacts.get(key);

  if (existing) {
    // Update with richer data
    if (contact.name && contact.name.length > (existing.name?.length || 0)) {
      existing.name = contact.name;
    }
    if (contact.company && !existing.company) {
      existing.company = contact.company;
    }
    if (contact.slackUserId && !existing.slackUserId) {
      existing.slackUserId = contact.slackUserId;
    }
    if (contact.role && !existing.role) {
      existing.role = contact.role;
    }
  } else {
    contacts.set(key, {
      ...contact,
      email: key,
      domain: extractDomain(key) || undefined
    });
  }

  // Also track company
  const domain = extractDomain(key);
  if (domain && !companies.has(domain)) {
    companies.set(domain, {
      name: contact.company || domain,
      domain,
      source: contact.source
    });
  }
}

/**
 * Extract contacts from a single email JSON file
 */
async function extractFromEmailFile(filePath: string): Promise<void> {
  try {
    const content = await Bun.file(filePath).json();

    // From
    if (content.headers?.from?.email) {
      addContact({
        name: content.headers.from.name || "",
        email: content.headers.from.email,
        source: "email"
      });
    }

    // To
    if (content.headers?.to) {
      for (const recipient of content.headers.to) {
        if (recipient.email) {
          addContact({
            name: recipient.name || "",
            email: recipient.email,
            source: "email"
          });
        }
      }
    }

    // CC
    if (content.headers?.cc) {
      for (const recipient of content.headers.cc) {
        if (recipient.email) {
          addContact({
            name: recipient.name || "",
            email: recipient.email,
            source: "email"
          });
        }
      }
    }

    // BCC
    if (content.headers?.bcc) {
      for (const recipient of content.headers.bcc) {
        if (recipient.email && !recipient.email.includes("bcc.hubspot.com")) {
          addContact({
            name: recipient.name || "",
            email: recipient.email,
            source: "email"
          });
        }
      }
    }
  } catch (err) {
    // Skip invalid files
  }
}

/**
 * Extract contacts from a single Slack JSON file
 */
async function extractFromSlackFile(filePath: string): Promise<void> {
  try {
    const messages = await Bun.file(filePath).json();

    for (const msg of messages) {
      if (msg.user_profile) {
        const profile = msg.user_profile;
        const userId = msg.user;

        // Track Slack user
        if (userId && profile.real_name) {
          slackUserMap.set(userId, {
            name: profile.real_name,
            email: profile.email
          });

          // Add as contact if we have email
          if (profile.email) {
            addContact({
              name: profile.real_name || profile.display_name || "",
              email: profile.email,
              slackUserId: userId,
              source: "slack"
            });
          }
        }
      }
    }
  } catch (err) {
    // Skip invalid files
  }
}

/**
 * Extract contacts from a single transcript JSON file
 */
async function extractFromTranscriptFile(filePath: string): Promise<void> {
  try {
    const content = await Bun.file(filePath).json();

    if (content.participants) {
      for (const participant of content.participants) {
        if (participant.email) {
          addContact({
            name: participant.name || "",
            email: participant.email,
            company: participant.company || undefined,
            role: participant.role || undefined,
            source: "transcript"
          });
        }
      }
    }
  } catch (err) {
    // Skip invalid files
  }
}

/**
 * Process all email JSON files
 */
async function processEmails(): Promise<number> {
  console.log("📧 Extracting contacts from emails...");
  let count = 0;

  const years = ["2020", "2021", "2022", "2023", "2024", "2025"];

  for (const year of years) {
    const yearPath = `${EMAIL_JSON_PATH}/${year}`;
    const glob = new Bun.Glob("*.json");

    try {
      for await (const file of glob.scan({ cwd: yearPath, absolute: true })) {
        await extractFromEmailFile(file);
        count++;
        if (count % 1000 === 0) {
          console.log(`   Processed ${count} emails...`);
        }
      }
    } catch {
      // Year directory doesn't exist
    }
  }

  console.log(`   ✅ Processed ${count} email files`);
  return count;
}

/**
 * Process all Slack JSON files
 */
async function processSlack(): Promise<number> {
  console.log("💬 Extracting contacts from Slack...");
  let count = 0;

  const glob = new Bun.Glob("**/*.json");

  for await (const file of glob.scan({ cwd: SLACK_JSON_PATH, absolute: true })) {
    await extractFromSlackFile(file);
    count++;
    if (count % 500 === 0) {
      console.log(`   Processed ${count} Slack files...`);
    }
  }

  console.log(`   ✅ Processed ${count} Slack files`);
  return count;
}

/**
 * Process all transcript JSON files
 */
async function processTranscripts(): Promise<number> {
  console.log("🎙️ Extracting contacts from transcripts...");
  let count = 0;

  const years = ["2023", "2024", "2025", "2026"];

  for (const year of years) {
    const yearPath = `${TRANSCRIPT_PATH}/${year}`;
    const glob = new Bun.Glob("*.json");

    try {
      for await (const file of glob.scan({ cwd: yearPath, absolute: true })) {
        await extractFromTranscriptFile(file);
        count++;
      }
    } catch {
      // Year directory doesn't exist
    }
  }

  console.log(`   ✅ Processed ${count} transcript files`);
  return count;
}

/**
 * Insert companies into database
 */
async function insertCompanies(): Promise<number> {
  console.log("🏢 Inserting companies...");
  const sql = getConnection();
  let count = 0;

  for (const [domain, company] of companies) {
    // Skip common email providers
    if (["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "me.com", "aol.com"].includes(domain)) {
      continue;
    }

    try {
      await sql`
        INSERT INTO companies (name, domain)
        VALUES (${company.name}, ${domain})
        ON CONFLICT (domain) DO NOTHING
      `;
      count++;
    } catch (err) {
      // Skip duplicates
    }
  }

  console.log(`   ✅ Inserted ${count} companies`);
  return count;
}

/**
 * Insert contacts into database
 */
async function insertContacts(): Promise<number> {
  console.log("👤 Inserting contacts...");
  const sql = getConnection();
  let count = 0;

  for (const [email, contact] of contacts) {
    try {
      // Look up company ID
      let companyId = null;
      if (contact.domain) {
        const companyResult = await sql`
          SELECT id FROM companies WHERE domain = ${contact.domain}
        `;
        if (companyResult.length > 0) {
          companyId = companyResult[0].id;
        }
      }

      const isMe = isMeEmail(email);

      await sql`
        INSERT INTO contacts (name, email, company_id, slack_user_id, role, is_me, first_seen_at)
        VALUES (
          ${contact.name || email.split("@")[0]},
          ${email},
          ${companyId},
          ${contact.slackUserId || null},
          ${contact.role || null},
          ${isMe},
          NOW()
        )
        ON CONFLICT (email) DO UPDATE SET
          name = COALESCE(NULLIF(EXCLUDED.name, ''), contacts.name),
          slack_user_id = COALESCE(EXCLUDED.slack_user_id, contacts.slack_user_id),
          role = COALESCE(EXCLUDED.role, contacts.role),
          last_seen_at = NOW()
      `;
      count++;

      if (count % 500 === 0) {
        console.log(`   Inserted ${count} contacts...`);
      }
    } catch (err) {
      // Skip errors
    }
  }

  console.log(`   ✅ Inserted ${count} contacts`);
  return count;
}

/**
 * Link email_chunks to contacts
 */
async function linkEmailContacts(): Promise<number> {
  console.log("🔗 Linking email contacts...");
  const sql = getConnection();

  const result = await sql`
    UPDATE email_chunks ec
    SET from_contact_id = c.id
    FROM contacts c
    WHERE LOWER(ec.from_email) = c.email
      AND ec.from_contact_id IS NULL
  `;

  const count = result.count || 0;
  console.log(`   ✅ Linked ${count} email chunks to contacts`);
  return count;
}

/**
 * Update contact counters
 */
async function updateContactCounters(): Promise<void> {
  console.log("📊 Updating contact counters...");
  const sql = getConnection();

  // Email count
  await sql`
    UPDATE contacts c
    SET email_count = (
      SELECT COUNT(DISTINCT email_id)
      FROM email_chunks
      WHERE from_contact_id = c.id
    )
  `;

  // Meeting count will be updated after transcript indexing

  console.log("   ✅ Updated contact counters");
}

/**
 * Main extraction function
 */
export async function runExtraction(): Promise<void> {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   Contact & Company Extraction         ║");
  console.log("╚════════════════════════════════════════╝\n");

  const startTime = Date.now();

  // Extract from all sources
  await processEmails();
  await processSlack();
  await processTranscripts();

  console.log(`\n📊 Extracted ${contacts.size} unique contacts, ${companies.size} unique companies\n`);

  // Insert into database
  await insertCompanies();
  await insertContacts();
  await linkEmailContacts();
  await updateContactCounters();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Extraction complete in ${elapsed}s`);

  // Print stats
  const sql = getConnection();
  const stats = await sql`
    SELECT
      (SELECT COUNT(*) FROM companies) as companies,
      (SELECT COUNT(*) FROM contacts) as contacts,
      (SELECT COUNT(*) FROM contacts WHERE is_me = true) as me_contacts,
      (SELECT COUNT(*) FROM email_chunks WHERE from_contact_id IS NOT NULL) as linked_emails
  `;

  console.log("\n📈 Database Stats:");
  console.log(`   Companies: ${stats[0].companies}`);
  console.log(`   Contacts: ${stats[0].contacts}`);
  console.log(`   'Me' Contacts: ${stats[0].me_contacts}`);
  console.log(`   Linked Emails: ${stats[0].linked_emails}`);
}

// Run if called directly
if (import.meta.main) {
  runExtraction()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });
}
