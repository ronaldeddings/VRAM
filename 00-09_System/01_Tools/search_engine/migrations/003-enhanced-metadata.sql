-- migrations/003-enhanced-metadata.sql
-- Enhanced Metadata & Granular Filtering
-- Created: 2026-01-18
-- Enables: contacts, companies, meeting metadata, year/month filtering

BEGIN;

-- ============================================
-- Phase 0.1: Companies Table
-- ============================================

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  aliases TEXT[] DEFAULT '{}',
  industry TEXT,
  is_customer BOOLEAN DEFAULT false,
  is_partner BOOLEAN DEFAULT false,
  is_prospect BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies USING gin(to_tsvector('english', name));

-- ============================================
-- Phase 0.2: Contacts Table
-- ============================================

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  company_id INTEGER REFERENCES companies(id),
  slack_user_id TEXT,
  role TEXT,
  is_me BOOLEAN DEFAULT false,
  first_seen_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  email_count INTEGER DEFAULT 0,
  meeting_count INTEGER DEFAULT 0,
  slack_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_slack ON contacts(slack_user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_contacts_is_me ON contacts(is_me);

-- ============================================
-- Phase 0.3: Transcript Meetings Table
-- ============================================

CREATE TABLE IF NOT EXISTS transcript_meetings (
  id SERIAL PRIMARY KEY,
  meeting_id TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  year INTEGER,
  month INTEGER,
  quarter INTEGER,
  is_internal BOOLEAN DEFAULT false,
  team_domain TEXT,
  permalink TEXT,
  video_url TEXT,
  participant_count INTEGER,
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meetings_date ON transcript_meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meetings_year ON transcript_meetings(year);
CREATE INDEX IF NOT EXISTS idx_meetings_month ON transcript_meetings(year, month);
CREATE INDEX IF NOT EXISTS idx_meetings_quarter ON transcript_meetings(year, quarter);
CREATE INDEX IF NOT EXISTS idx_meetings_internal ON transcript_meetings(is_internal);
CREATE INDEX IF NOT EXISTS idx_meetings_title ON transcript_meetings USING gin(to_tsvector('english', coalesce(title, '')));
CREATE INDEX IF NOT EXISTS idx_meetings_meeting_id ON transcript_meetings(meeting_id);

-- ============================================
-- Phase 0.4: Meeting Participants Junction Table
-- ============================================

CREATE TABLE IF NOT EXISTS meeting_participants (
  id SERIAL PRIMARY KEY,
  meeting_id INTEGER REFERENCES transcript_meetings(id) ON DELETE CASCADE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  role TEXT,
  speaking_time_seconds INTEGER,
  UNIQUE(meeting_id, contact_id)
);

CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting ON meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_contact ON meeting_participants(contact_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_role ON meeting_participants(role);

COMMIT;

-- ============================================
-- Phase 0.5: Enhance Email Chunks
-- (Outside transaction for ALTER TABLE)
-- ============================================

ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS cc_emails TEXT[] DEFAULT '{}';
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS bcc_emails TEXT[] DEFAULT '{}';
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS thread_id TEXT;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS month INTEGER;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS quarter INTEGER;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS is_sent_by_me BOOLEAN DEFAULT false;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS from_contact_id INTEGER REFERENCES contacts(id);
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS importance TEXT;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS attachment_count INTEGER DEFAULT 0;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS attachment_names TEXT[] DEFAULT '{}';

-- Populate year/month/quarter from email_date
UPDATE email_chunks SET
  year = EXTRACT(YEAR FROM email_date)::INTEGER,
  month = EXTRACT(MONTH FROM email_date)::INTEGER,
  quarter = EXTRACT(QUARTER FROM email_date)::INTEGER
WHERE year IS NULL AND email_date IS NOT NULL;

-- Detect sent_by_me based on from_email containing common user emails
UPDATE email_chunks SET is_sent_by_me = true
WHERE LOWER(from_email) LIKE '%@hackervalley.com'
  AND LOWER(from_email) LIKE 'ron%';

-- Add indexes for new filter columns
CREATE INDEX IF NOT EXISTS idx_email_year ON email_chunks(year);
CREATE INDEX IF NOT EXISTS idx_email_month ON email_chunks(year, month);
CREATE INDEX IF NOT EXISTS idx_email_quarter ON email_chunks(year, quarter);
CREATE INDEX IF NOT EXISTS idx_email_sent_by_me ON email_chunks(is_sent_by_me);
CREATE INDEX IF NOT EXISTS idx_email_thread ON email_chunks(thread_id);
CREATE INDEX IF NOT EXISTS idx_email_from_contact ON email_chunks(from_contact_id);
CREATE INDEX IF NOT EXISTS idx_email_cc ON email_chunks USING gin(cc_emails);
CREATE INDEX IF NOT EXISTS idx_email_bcc ON email_chunks USING gin(bcc_emails);
CREATE INDEX IF NOT EXISTS idx_email_attachments ON email_chunks(attachment_count) WHERE attachment_count > 0;

-- ============================================
-- Phase 0.6: Enhance Slack Chunks
-- ============================================

ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS real_names TEXT[] DEFAULT '{}';
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS companies TEXT[] DEFAULT '{}';
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS thread_ts TEXT;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS is_thread_reply BOOLEAN DEFAULT false;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS month INTEGER;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS quarter INTEGER;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS emoji_reactions TEXT[] DEFAULT '{}';
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS reply_count INTEGER DEFAULT 0;

-- Populate year/month/quarter from message_date
UPDATE slack_chunks SET
  year = EXTRACT(YEAR FROM message_date)::INTEGER,
  month = EXTRACT(MONTH FROM message_date)::INTEGER,
  quarter = EXTRACT(QUARTER FROM message_date)::INTEGER
WHERE year IS NULL AND message_date IS NOT NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_slack_year ON slack_chunks(year);
CREATE INDEX IF NOT EXISTS idx_slack_month ON slack_chunks(year, month);
CREATE INDEX IF NOT EXISTS idx_slack_quarter ON slack_chunks(year, quarter);
CREATE INDEX IF NOT EXISTS idx_slack_thread ON slack_chunks(thread_ts);
CREATE INDEX IF NOT EXISTS idx_slack_thread_reply ON slack_chunks(is_thread_reply);
CREATE INDEX IF NOT EXISTS idx_slack_real_names ON slack_chunks USING gin(real_names);
CREATE INDEX IF NOT EXISTS idx_slack_companies ON slack_chunks USING gin(companies);
CREATE INDEX IF NOT EXISTS idx_slack_edited ON slack_chunks(is_edited) WHERE is_edited = true;

-- ============================================
-- Phase 0.7: Enhance Chunks (Transcripts)
-- ============================================

ALTER TABLE chunks ADD COLUMN IF NOT EXISTS meeting_id INTEGER REFERENCES transcript_meetings(id);
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS month INTEGER;
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS quarter INTEGER;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_chunks_meeting ON chunks(meeting_id);
CREATE INDEX IF NOT EXISTS idx_chunks_year ON chunks(year);
CREATE INDEX IF NOT EXISTS idx_chunks_month ON chunks(year, month);
CREATE INDEX IF NOT EXISTS idx_chunks_quarter ON chunks(year, quarter);

-- ============================================
-- Phase 0.8: Helper Functions
-- ============================================

-- Function to extract domain from email address
CREATE OR REPLACE FUNCTION extract_email_domain(email_addr TEXT)
RETURNS TEXT AS $$
BEGIN
  IF email_addr IS NULL OR email_addr = '' THEN
    RETURN NULL;
  END IF;
  RETURN LOWER(SPLIT_PART(email_addr, '@', 2));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get or create company by domain
CREATE OR REPLACE FUNCTION get_or_create_company(domain_name TEXT, company_name TEXT DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
  company_id INTEGER;
BEGIN
  IF domain_name IS NULL OR domain_name = '' THEN
    RETURN NULL;
  END IF;

  -- Try to find existing company
  SELECT id INTO company_id FROM companies WHERE domain = LOWER(domain_name);

  IF company_id IS NULL THEN
    -- Create new company
    INSERT INTO companies (name, domain)
    VALUES (COALESCE(company_name, domain_name), LOWER(domain_name))
    ON CONFLICT (domain) DO UPDATE SET name = COALESCE(EXCLUDED.name, companies.name)
    RETURNING id INTO company_id;
  END IF;

  RETURN company_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get or create contact by email
CREATE OR REPLACE FUNCTION get_or_create_contact(
  contact_email TEXT,
  contact_name TEXT DEFAULT NULL,
  contact_company_id INTEGER DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  contact_id INTEGER;
  domain_name TEXT;
  derived_company_id INTEGER;
BEGIN
  IF contact_email IS NULL OR contact_email = '' THEN
    RETURN NULL;
  END IF;

  -- Try to find existing contact
  SELECT id INTO contact_id FROM contacts WHERE email = LOWER(contact_email);

  IF contact_id IS NULL THEN
    -- Extract domain and get/create company
    domain_name := extract_email_domain(contact_email);
    IF contact_company_id IS NULL AND domain_name IS NOT NULL THEN
      derived_company_id := get_or_create_company(domain_name);
    ELSE
      derived_company_id := contact_company_id;
    END IF;

    -- Create new contact
    INSERT INTO contacts (email, name, company_id, first_seen_at)
    VALUES (LOWER(contact_email), COALESCE(contact_name, SPLIT_PART(contact_email, '@', 1)), derived_company_id, NOW())
    ON CONFLICT (email) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, contacts.name),
      last_seen_at = NOW()
    RETURNING id INTO contact_id;
  ELSE
    -- Update last_seen_at
    UPDATE contacts SET last_seen_at = NOW() WHERE id = contact_id;
  END IF;

  RETURN contact_id;
END;
$$ LANGUAGE plpgsql;

-- Analyze all tables
ANALYZE companies;
ANALYZE contacts;
ANALYZE transcript_meetings;
ANALYZE meeting_participants;
ANALYZE email_chunks;
ANALYZE slack_chunks;
ANALYZE chunks;
