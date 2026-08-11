-- Public agenda projection. Discord identifiers and raw payloads are never stored.
-- This database is staging-only until the projection boundary is approved for
-- production; keep the first migration equal to the deployed contract.
CREATE TABLE agenda_entries (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  start_at TEXT NOT NULL,
  end_at TEXT,
  timezone TEXT NOT NULL CHECK (timezone = 'Asia/Jakarta'),
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'active', 'withdrawn')),
  program TEXT NOT NULL,
  series TEXT,
  join_url TEXT NOT NULL CHECK (join_url = 'https://discord.gg/RUFFbEaeDx'),
  source TEXT NOT NULL CHECK (source = 'discord_scheduled_event'),
  revision INTEGER NOT NULL,
  generated_at TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  withdrawn_at TEXT
);

CREATE INDEX agenda_entries_status_start_idx
  ON agenda_entries (status, start_at);

CREATE TABLE ingest_nonces (
  nonce TEXT PRIMARY KEY NOT NULL,
  issued_at TEXT NOT NULL,
  revision INTEGER NOT NULL,
  content_sha256 TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX ingest_nonces_expires_idx
  ON ingest_nonces (expires_at);

CREATE TABLE agenda_checkpoint (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision INTEGER NOT NULL,
  observed_at TEXT NOT NULL,
  received_at TEXT NOT NULL
);

CREATE TRIGGER agenda_checkpoint_revision_guard
BEFORE UPDATE OF revision ON agenda_checkpoint
WHEN NEW.revision <= OLD.revision
BEGIN
  SELECT RAISE(ABORT, 'revision is not newer than checkpoint');
END;
