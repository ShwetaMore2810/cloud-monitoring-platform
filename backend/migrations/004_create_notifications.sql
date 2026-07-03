CREATE TABLE IF NOT EXISTS notifications (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    alert_id INTEGER REFERENCES alerts(id),

    title TEXT NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT now()
);