-- Letter access: per-recipient tokens for sharing private long-form letters
-- (e.g. /voor-chris/[token]) with NDA gate and basic visit logging.

CREATE TABLE IF NOT EXISTS letter_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  letter_id text NOT NULL DEFAULT 'voor-chris',
  recipient_name text NOT NULL,
  recipient_email text,
  notes text,
  created_at timestamptz DEFAULT now(),
  revoked_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_letter_tokens_token ON letter_tokens(token);
CREATE INDEX IF NOT EXISTS idx_letter_tokens_letter ON letter_tokens(letter_id);

CREATE TABLE IF NOT EXISTS letter_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid NOT NULL REFERENCES letter_tokens(id) ON DELETE CASCADE,
  event text NOT NULL CHECK (event IN ('visit', 'nda_accepted')),
  occurred_at timestamptz DEFAULT now(),
  ip text,
  user_agent text
);

CREATE INDEX IF NOT EXISTS idx_letter_access_log_token ON letter_access_log(token_id, occurred_at DESC);

-- Lock the tables: only the service role (used by our /api/* routes) can read/write.
-- The public anon key, which is exposed in the frontend, gets nothing.
-- (Service role bypasses RLS, so our route handlers continue to work normally.)
ALTER TABLE letter_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE letter_access_log ENABLE ROW LEVEL SECURITY;
