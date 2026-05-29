-- Mira Chat Logging Table (PUBLIC SCHEMA)
-- Tracks chat sessions with Mira AI for usage analytics
-- Minimal data collection: just tracks that a chat happened
-- This table is explicitly in the PUBLIC schema to ensure visibility in Supabase

CREATE TABLE IF NOT EXISTS public.mira_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for query performance
CREATE INDEX IF NOT EXISTS idx_mira_chats_date ON public.mira_chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mira_chats_anonymous ON public.mira_chats(anonymous_id);

-- Enable Row Level Security
ALTER TABLE public.mira_chats ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can insert, no one can read/modify
DROP POLICY IF EXISTS "mira_chats_public_insert" ON public.mira_chats;
CREATE POLICY "mira_chats_public_insert" ON public.mira_chats FOR INSERT WITH CHECK (true);
