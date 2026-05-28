-- UNMUTE Echoes migration
-- Run this in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS echo_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_index INTEGER NOT NULL CHECK (question_index >= 0 AND question_index <= 29),
  answer_text TEXT NOT NULL CHECK (char_length(answer_text) <= 180),
  anonymous_user_id TEXT NOT NULL,
  felt_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE echo_answers ADD COLUMN IF NOT EXISTS question_index INTEGER;
ALTER TABLE echo_answers ADD COLUMN IF NOT EXISTS answer_text TEXT;
ALTER TABLE echo_answers ADD COLUMN IF NOT EXISTS anonymous_user_id TEXT;
ALTER TABLE echo_answers ADD COLUMN IF NOT EXISTS felt_count INTEGER DEFAULT 0;
ALTER TABLE echo_answers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE echo_answers ADD COLUMN IF NOT EXISTS feature TEXT NOT NULL DEFAULT 'echo' CHECK (feature IN ('echo', 'unsent'));
ALTER TABLE echo_answers ADD COLUMN IF NOT EXISTS recipient_type TEXT;
ALTER TABLE echo_answers ADD COLUMN IF NOT EXISTS full_letter TEXT;
ALTER TABLE echo_answers ADD COLUMN IF NOT EXISTS opening_line TEXT;
ALTER TABLE echo_answers ALTER COLUMN question_index DROP NOT NULL;

CREATE OR REPLACE VIEW public.unsent_public AS
  SELECT id, recipient_type, opening_line, anonymous_user_id, felt_count, created_at, feature
  FROM public.echo_answers
  WHERE feature = 'unsent';

CREATE TABLE IF NOT EXISTS echo_felts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID REFERENCES echo_answers(id) ON DELETE CASCADE,
  anonymous_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (answer_id, anonymous_user_id)
);

CREATE INDEX IF NOT EXISTS idx_echo_answers_today ON echo_answers(question_index, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_echo_answers_anonymous_user ON echo_answers(anonymous_user_id);
CREATE INDEX IF NOT EXISTS idx_echo_felts_answer ON echo_felts(answer_id);

ALTER TABLE echo_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE echo_felts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "echo_answers_public_read" ON echo_answers;
DROP POLICY IF EXISTS "echo_answers_public_insert" ON echo_answers;
DROP POLICY IF EXISTS "echo_felts_public_read" ON echo_felts;
DROP POLICY IF EXISTS "echo_felts_public_insert" ON echo_felts;

CREATE POLICY "echo_answers_public_read"
  ON echo_answers
  FOR SELECT
  USING (created_at::date = CURRENT_DATE);

CREATE POLICY "echo_answers_public_insert"
  ON echo_answers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "echo_felts_public_read"
  ON echo_felts
  FOR SELECT
  USING (true);

CREATE POLICY "echo_felts_public_insert"
  ON echo_felts
  FOR INSERT
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION increment_echo_felt_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE echo_answers
  SET felt_count = felt_count + 1
  WHERE id = NEW.answer_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_echo_felt_insert ON echo_felts;
CREATE TRIGGER on_echo_felt_insert
  AFTER INSERT ON echo_felts
  FOR EACH ROW
  EXECUTE FUNCTION increment_echo_felt_count();

CREATE OR REPLACE FUNCTION delete_echo_answer(
  answer_id UUID,
  requester_anonymous_user_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM echo_answers
  WHERE id = answer_id
    AND anonymous_user_id = requester_anonymous_user_id;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count > 0;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'echo_answers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE echo_answers;
  END IF;
END;
$$;
