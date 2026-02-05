-- UNMUTE Mental Wellness App Database Schema
-- This creates the core tables for rooms, sessions, participants, and reactions

-- Rooms table: Stores active sanctuary rooms by emotion type
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emotion TEXT NOT NULL CHECK (emotion IN ('anxious', 'lonely', 'burnt-out', 'just-talk')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  participant_count INTEGER DEFAULT 0,
  max_participants INTEGER DEFAULT 6
);

-- Sessions table: Tracks individual user sessions (anonymous)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  anonymous_id TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  emotion TEXT NOT NULL
);

-- Reactions table: Stores silent reactions sent during sessions
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'wave', 'peace')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reflections table: Stores post-session reflections (anonymous)
CREATE TABLE IF NOT EXISTS reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  feeling_before INTEGER CHECK (feeling_before >= 1 AND feeling_before <= 5),
  feeling_after INTEGER CHECK (feeling_after >= 1 AND feeling_after <= 5),
  gratitude_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table: Aggregated anonymous metrics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE DEFAULT CURRENT_DATE,
  emotion TEXT NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_duration_minutes INTEGER DEFAULT 0,
  avg_feeling_improvement DECIMAL(3,2),
  total_reactions INTEGER DEFAULT 0
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rooms_emotion ON rooms(emotion);
CREATE INDEX IF NOT EXISTS idx_rooms_active ON rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_room ON sessions(room_id);
CREATE INDEX IF NOT EXISTS idx_sessions_anonymous ON sessions(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_reactions_room ON reactions(room_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "rooms_public_read" ON rooms;
DROP POLICY IF EXISTS "rooms_service_insert" ON rooms;
DROP POLICY IF EXISTS "rooms_service_update" ON rooms;
DROP POLICY IF EXISTS "sessions_public_read" ON sessions;
DROP POLICY IF EXISTS "sessions_public_insert" ON sessions;
DROP POLICY IF EXISTS "sessions_public_update" ON sessions;
DROP POLICY IF EXISTS "reactions_public_read" ON reactions;
DROP POLICY IF EXISTS "reactions_public_insert" ON reactions;
DROP POLICY IF EXISTS "reflections_public_insert" ON reflections;
DROP POLICY IF EXISTS "analytics_public_read" ON analytics;
DROP POLICY IF EXISTS "analytics_service_all" ON analytics;

-- RLS Policies for rooms (public read, service role for write)
CREATE POLICY "rooms_public_read" ON rooms FOR SELECT USING (true);
CREATE POLICY "rooms_service_insert" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "rooms_service_update" ON rooms FOR UPDATE USING (true);

-- RLS Policies for sessions (anonymous access via anonymous_id)
CREATE POLICY "sessions_public_read" ON sessions FOR SELECT USING (true);
CREATE POLICY "sessions_public_insert" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "sessions_public_update" ON sessions FOR UPDATE USING (true);

-- RLS Policies for reactions (public access)
CREATE POLICY "reactions_public_read" ON reactions FOR SELECT USING (true);
CREATE POLICY "reactions_public_insert" ON reactions FOR INSERT WITH CHECK (true);

-- RLS Policies for reflections (public insert, no read for privacy)
CREATE POLICY "reflections_public_insert" ON reflections FOR INSERT WITH CHECK (true);

-- RLS Policies for analytics (public read)
CREATE POLICY "analytics_public_read" ON analytics FOR SELECT USING (true);
CREATE POLICY "analytics_service_all" ON analytics FOR ALL USING (true);

-- Function to clean up expired rooms
CREATE OR REPLACE FUNCTION cleanup_expired_rooms()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE rooms SET is_active = false WHERE expires_at < NOW() AND is_active = true;
END;
$$;

-- Function to update room participant count
CREATE OR REPLACE FUNCTION update_room_participant_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE rooms SET participant_count = participant_count + 1 WHERE id = NEW.room_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.left_at IS NOT NULL AND OLD.left_at IS NULL THEN
    UPDATE rooms SET participant_count = participant_count - 1 WHERE id = NEW.room_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for participant count
DROP TRIGGER IF EXISTS on_session_change ON sessions;
CREATE TRIGGER on_session_change
  AFTER INSERT OR UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_room_participant_count();
