CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    server_id INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,

    metric VARCHAR(30) NOT NULL,

    operator VARCHAR(5) NOT NULL,

    threshold NUMERIC NOT NULL,

    enabled BOOLEAN DEFAULT TRUE,

    cooldown INTEGER DEFAULT 5,

    last_triggered TIMESTAMP,

    created_at TIMESTAMP DEFAULT now()
);