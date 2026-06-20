import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Create users table if it doesn't exist
const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(createTableQuery);
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

createUsersTable();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (req.url === '/api/register') {
    try {
      // Check if user already exists
      const userExists = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassword]
      );

      return res.status(201).json({
        success: true,
        user: {
          id: result.rows[0].id,
          email: result.rows[0].email,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Error creating user' });
    }
  } else if (req.url === '/api/login') {
    try {
      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare password
      const valid = await bcrypt.compare(password, result.rows[0].password);

      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: result.rows[0].id,
          email: result.rows[0].email,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Error logging in' });
    }
  }

  return res.status(404).json({ message: 'Route not found' });
}