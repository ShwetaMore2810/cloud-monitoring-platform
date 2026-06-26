CREATE TABLE IF NOT EXISTS servers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  host TEXT NOT NULL,
  username TEXT NOT NULL,
  auth_type TEXT DEFAULT 'pem',
  key_reference TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS metrics_history (
  id SERIAL PRIMARY KEY,
  server_id INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  collected_at TIMESTAMP NOT NULL DEFAULT now(),
  cpu NUMERIC,
  mem_total INTEGER,
  mem_used INTEGER,
  mem_free INTEGER,
  mem_usage_percent NUMERIC,
  disk_filesystem TEXT,
  disk_size TEXT,
  disk_used TEXT,
  disk_available TEXT,
  disk_usage_percent INTEGER,
  load1 NUMERIC,
  load5 NUMERIC,
  load15 NUMERIC
);
