CREATE TABLE admin_sessions (
  id uuid PRIMARY KEY,
  expires_at timestamptz NOT NULL
);
CREATE INDEX admin_session_expiry_idx ON admin_sessions(expires_at);
CREATE TABLE admin_refresh_tokens (
  digest text PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES admin_sessions(id) ON DELETE CASCADE,
  consumed boolean NOT NULL DEFAULT false
);
CREATE INDEX admin_refresh_session_idx ON admin_refresh_tokens(session_id);
