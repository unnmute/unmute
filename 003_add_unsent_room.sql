-- UNMUTE Unsent Room migration
-- Run this in the Supabase SQL editor after the Echoes schema exists.

ALTER TABLE public.echo_answers
ADD COLUMN IF NOT EXISTS feature TEXT NOT NULL DEFAULT 'echo'
  CHECK (feature IN ('echo', 'unsent'));

ALTER TABLE public.echo_answers
ADD COLUMN IF NOT EXISTS recipient_type TEXT;

ALTER TABLE public.echo_answers
ADD COLUMN IF NOT EXISTS full_letter TEXT;

ALTER TABLE public.echo_answers
ADD COLUMN IF NOT EXISTS opening_line TEXT;

ALTER TABLE public.echo_answers
ALTER COLUMN question_index DROP NOT NULL;

CREATE OR REPLACE VIEW public.unsent_public AS
  SELECT id, recipient_type, opening_line, anonymous_user_id,
         felt_count, created_at, feature
  FROM public.echo_answers
  WHERE feature = 'unsent';

NOTIFY pgrst, 'reload schema';

