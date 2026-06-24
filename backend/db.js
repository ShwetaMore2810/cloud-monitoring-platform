// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For many managed DBs you may need ssl: { rejectUnauthorized: false }
  // e.g. if (process.env.NODE_ENV === 'production') pool.options.ssl = { rejectUnauthorized: false }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};