-- Automated report and ban system for UNMUTE.
-- Run this in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.anonymous_device_joins (
  fingerprint text PRIMARY KEY,
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  last_joined_at timestamptz,
  join_count integer DEFAULT 0,
  user_email text,
  google_user_id uuid,
  report_count integer DEFAULT 0,
  is_banned boolean DEFAULT false,
  banned_at timestamptz,
  auto_banned boolean DEFAULT false
);

ALTER TABLE public.anonymous_device_joins
ADD COLUMN IF NOT EXISTS report_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS join_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS banned_at timestamptz,
ADD COLUMN IF NOT EXISTS auto_banned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS first_seen timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_seen timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_joined_at timestamptz,
ADD COLUMN IF NOT EXISTS user_email text,
ADD COLUMN IF NOT EXISTS google_user_id uuid;

CREATE UNIQUE INDEX IF NOT EXISTS anonymous_device_joins_fingerprint_key
ON public.anonymous_device_joins(fingerprint);

ALTER TABLE public.sessions
ADD COLUMN IF NOT EXISTS room_alias text;

CREATE TABLE IF NOT EXISTS public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reporter_fingerprint text NOT NULL,
  reported_fingerprint text NOT NULL,
  reported_alias text NOT NULL,
  room_id uuid REFERENCES public.rooms(id),
  reason text NOT NULL CHECK (reason IN (
    'harassment',
    'hate_speech',
    'inappropriate_content',
    'self_harm_concern',
    'other'
  )),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT one_report_per_pair_per_room
    UNIQUE (reporter_fingerprint, reported_fingerprint, room_id)
);

CREATE INDEX IF NOT EXISTS idx_reports_reported_fingerprint
ON public.reports(reported_fingerprint);

CREATE INDEX IF NOT EXISTS idx_reports_room
ON public.reports(room_id);

ALTER TABLE public.anonymous_device_joins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anonymous_device_joins_public_read" ON public.anonymous_device_joins;
DROP POLICY IF EXISTS "anonymous_device_joins_public_insert" ON public.anonymous_device_joins;
DROP POLICY IF EXISTS "anonymous_device_joins_public_update" ON public.anonymous_device_joins;
DROP POLICY IF EXISTS "reports_public_insert" ON public.reports;

CREATE POLICY "anonymous_device_joins_public_read"
ON public.anonymous_device_joins FOR SELECT
USING (true);

CREATE POLICY "anonymous_device_joins_public_insert"
ON public.anonymous_device_joins FOR INSERT
WITH CHECK (true);

CREATE POLICY "anonymous_device_joins_public_update"
ON public.anonymous_device_joins FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "reports_public_insert"
ON public.reports FOR INSERT
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.auto_ban_on_threshold()
RETURNS TRIGGER AS $$
DECLARE
  current_count integer;
BEGIN
  INSERT INTO public.anonymous_device_joins (fingerprint)
  VALUES (NEW.reported_fingerprint)
  ON CONFLICT (fingerprint) DO NOTHING;

  UPDATE public.anonymous_device_joins
  SET report_count = COALESCE(report_count, 0) + 1
  WHERE fingerprint = NEW.reported_fingerprint
  RETURNING report_count INTO current_count;

  IF current_count >= 3 THEN
    UPDATE public.anonymous_device_joins
    SET
      is_banned = true,
      banned_at = now(),
      auto_banned = true
    WHERE fingerprint = NEW.reported_fingerprint
      AND is_banned = false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_ban ON public.reports;
CREATE TRIGGER trigger_auto_ban
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.auto_ban_on_threshold();
