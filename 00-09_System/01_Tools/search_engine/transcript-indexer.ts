/**
 * Transcript Meeting Indexer
 *
 * Parses Fathom JSON files and populates:
 * - transcript_meetings (meeting metadata)
 * - meeting_participants (junction table)
 * - chunks.meeting_id (link chunks to meetings)
 */

import { getConnection } from "./pg-client";

const VRAM = "/Volumes/VRAM";
const TRANSCRIPT_PATH = `${VRAM}/Backup/meetings/fathom_json`;
const MY_DOMAIN = "hackervalley.com";

interface FathomParticipant {
  id: string;
  name: string;
  email?: string;
  role: string;
  company?: string;
}

interface FathomRecording {
  id: string;
  url: string;
  duration: string;
  startTime: string;
  endTime?: string;
}

interface FathomJSON {
  id: string;
  title: string;
  description?: string;
  participants: FathomParticipant[];
  recording: FathomRecording;
  video_url?: string;
  transcript?: {
    cues: Array<{
      id: string;
      start: number;
      end: number;
      text: string;
      speaker: string;
    }>;
  };
}

/**
 * Parse duration string like "26 mins" to minutes
 */
function parseDuration(duration: string): number | null {
  if (!duration) return null;
  const match = duration.match(/(\d+)\s*min/i);
  if (match) return parseInt(match[1], 10);

  const hourMatch = duration.match(/(\d+)\s*hour/i);
  if (hourMatch) return parseInt(hourMatch[1], 10) * 60;

  return null;
}

/**
 * Check if meeting is internal (all participants from MY_DOMAIN)
 */
function isInternalMeeting(participants: FathomParticipant[]): boolean {
  const externalCount = participants.filter(p => {
    if (!p.email) return false;
    const domain = p.email.split("@")[1]?.toLowerCase();
    return domain && domain !== MY_DOMAIN;
  }).length;

  return externalCount === 0;
}

/**
 * Get unique participants (dedupe by email or name)
 */
function getUniqueParticipants(participants: FathomParticipant[]): FathomParticipant[] {
  const seen = new Map<string, FathomParticipant>();

  for (const p of participants) {
    const key = p.email?.toLowerCase() || p.name.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, p);
    } else {
      // Merge with existing - prefer more data
      const existing = seen.get(key)!;
      if (!existing.email && p.email) existing.email = p.email;
      if (!existing.company && p.company) existing.company = p.company;
      if (!existing.role && p.role) existing.role = p.role;
    }
  }

  return Array.from(seen.values());
}

/**
 * Process a single transcript JSON file
 */
async function processTranscriptFile(filePath: string, sql: ReturnType<typeof getConnection>): Promise<boolean> {
  try {
    const content: FathomJSON = await Bun.file(filePath).json();

    if (!content.id || !content.recording?.startTime) {
      return false;
    }

    const meetingId = content.id;
    const startTime = new Date(content.recording.startTime);
    const duration = parseDuration(content.recording.duration);
    const uniqueParticipants = getUniqueParticipants(content.participants || []);
    const isInternal = isInternalMeeting(uniqueParticipants);

    // Extract year, month, quarter
    const year = startTime.getFullYear();
    const month = startTime.getMonth() + 1;
    const quarter = Math.ceil(month / 3);

    // Insert meeting
    const meetingResult = await sql`
      INSERT INTO transcript_meetings (
        meeting_id, title, description, start_time, duration_minutes,
        year, month, quarter, is_internal, team_domain,
        video_url, participant_count, file_path
      )
      VALUES (
        ${meetingId},
        ${content.title || null},
        ${content.description || null},
        ${startTime.toISOString()},
        ${duration},
        ${year},
        ${month},
        ${quarter},
        ${isInternal},
        ${MY_DOMAIN},
        ${content.video_url || content.recording.url || null},
        ${uniqueParticipants.length},
        ${filePath}
      )
      ON CONFLICT (meeting_id) DO UPDATE SET
        title = COALESCE(EXCLUDED.title, transcript_meetings.title),
        duration_minutes = COALESCE(EXCLUDED.duration_minutes, transcript_meetings.duration_minutes),
        participant_count = EXCLUDED.participant_count,
        updated_at = NOW()
      RETURNING id
    `;

    const dbMeetingId = meetingResult[0]?.id;
    if (!dbMeetingId) return false;

    // Insert participants
    for (const participant of uniqueParticipants) {
      if (!participant.email && !participant.name) continue;

      // Find or skip contact (we'll link by email if available)
      let contactId = null;
      if (participant.email) {
        const contactResult = await sql`
          SELECT id FROM contacts WHERE email = ${participant.email.toLowerCase()}
        `;
        if (contactResult.length > 0) {
          contactId = contactResult[0].id;
        }
      }

      // Insert participant link
      await sql`
        INSERT INTO meeting_participants (meeting_id, contact_id, role)
        VALUES (${dbMeetingId}, ${contactId}, ${participant.role || 'attendee'})
        ON CONFLICT (meeting_id, contact_id) DO NOTHING
      `.catch(() => {
        // Skip if contact_id is null and we can't insert
      });

      // Update contact meeting count
      if (contactId) {
        await sql`
          UPDATE contacts
          SET meeting_count = meeting_count + 1,
              last_seen_at = GREATEST(last_seen_at, ${startTime.toISOString()}::timestamptz)
          WHERE id = ${contactId}
        `;
      }
    }

    // Link chunks to meeting (by file path)
    await sql`
      UPDATE chunks
      SET meeting_id = ${dbMeetingId},
          year = ${year},
          month = ${month},
          quarter = ${quarter}
      WHERE file_path = ${filePath}
         OR file_path LIKE ${`%${meetingId}%`}
    `;

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Main indexing function
 */
export async function runTranscriptIndexing(): Promise<void> {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   Transcript Meeting Indexer           ║");
  console.log("╚════════════════════════════════════════╝\n");

  const startTime = Date.now();
  const sql = getConnection();

  let processed = 0;
  let indexed = 0;

  const years = ["2023", "2024", "2025", "2026"];

  for (const year of years) {
    const yearPath = `${TRANSCRIPT_PATH}/${year}`;
    const glob = new Bun.Glob("*.json");

    try {
      for await (const file of glob.scan({ cwd: yearPath, absolute: true })) {
        processed++;
        const success = await processTranscriptFile(file, sql);
        if (success) indexed++;

        if (processed % 100 === 0) {
          console.log(`   Processed ${processed} files, indexed ${indexed} meetings...`);
        }
      }
    } catch {
      // Year directory doesn't exist
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Transcript indexing complete in ${elapsed}s`);
  console.log(`   Processed: ${processed} files`);
  console.log(`   Indexed: ${indexed} meetings`);

  // Print stats
  const stats = await sql`
    SELECT
      (SELECT COUNT(*) FROM transcript_meetings) as meetings,
      (SELECT COUNT(*) FROM meeting_participants) as participants,
      (SELECT COUNT(*) FROM transcript_meetings WHERE is_internal = true) as internal,
      (SELECT COUNT(*) FROM transcript_meetings WHERE is_internal = false) as external,
      (SELECT COUNT(DISTINCT contact_id) FROM meeting_participants WHERE contact_id IS NOT NULL) as linked_contacts
  `;

  console.log("\n📈 Meeting Stats:");
  console.log(`   Total Meetings: ${stats[0].meetings}`);
  console.log(`   Internal: ${stats[0].internal}`);
  console.log(`   External: ${stats[0].external}`);
  console.log(`   Participant Links: ${stats[0].participants}`);
  console.log(`   Linked Contacts: ${stats[0].linked_contacts}`);
}

// Run if called directly
if (import.meta.main) {
  runTranscriptIndexing()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });
}
