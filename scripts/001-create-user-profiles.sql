-- Create user_profiles table to store terms acceptance for authenticated users
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  has_accepted_terms BOOLEAN NOT NULL DEFAULT FALSE,
  terms_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
