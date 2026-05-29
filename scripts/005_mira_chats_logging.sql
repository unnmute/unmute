-- Mira Chat Logging Table
-- Tracks chat sessions with Mira AI for usage analytics
-- Minimal data collection: just tracks that a chat happened

CREATE TABLE IF NOT EXISTS mira_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for query performance
CREATE INDEX IF NOT EXISTS idx_mira_chats_date ON mira_chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mira_chats_anonymous ON mira_chats(anonymous_id);

-- Enable Row Level Security
ALTER TABLE mira_chats ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can insert, no one can read/modify
CREATE POLICY "mira_chats_public_insert" ON mira_chats FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "mira_chats_public_insert" ON mira_chats;
CREATE POLICY "mira_chats_public_insert" ON mira_chats FOR INSERT WITH CHECK (true);
