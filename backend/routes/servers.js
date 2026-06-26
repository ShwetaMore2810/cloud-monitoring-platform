// backend/routes/servers.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Require auth middleware at mount point in server.js, or require here
// GET all servers for current user
router.get('/', async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await db.query('SELECT id, name, host, username, auth_type, key_reference, created_at FROM servers WHERE user_id = $1 ORDER BY id DESC', [userId]);
    res.json({ servers: result.rows });
  } catch (err) {
    console.error('Get servers error:', err);
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// Create a new server
router.post('/', async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { name, host, username, auth_type, key_reference } = req.body;
  if (!host || !username) return res.status(400).json({ error: 'host and username required' });

  try {
    const result = await db.query(
      'INSERT INTO servers (user_id, name, host, username, auth_type, key_reference) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, host, username, auth_type, key_reference, created_at',
      [userId, name || null, host, username, auth_type || 'pem', key_reference || null]
    );
    res.status(201).json({ server: result.rows[0] });
  } catch (err) {
    console.error('Create server error:', err);
    res.status(500).json({ error: 'Failed to create server' });
  }
});

// Update server (only owner)
router.put('/:id', async (req, res) => {
  const userId = req.user?.userId;
  const serverId = parseInt(req.params.id, 10);
  const { name, host, username, auth_type, key_reference } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await db.query(
      `UPDATE servers SET name=$1, host=$2, username=$3, auth_type=$4, key_reference=$5
       WHERE id=$6 AND user_id=$7 RETURNING id, name, host, username, auth_type, key_reference, created_at`,
      [name || null, host, username, auth_type || 'pem', key_reference || null, serverId, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Server not found' });
    res.json({ server: result.rows[0] });
  } catch (err) {
    console.error('Update server error:', err);
    res.status(500).json({ error: 'Failed to update server' });
  }
});

// Delete server
router.delete('/:id', async (req, res) => {
  const userId = req.user?.userId;
  const serverId = parseInt(req.params.id, 10);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await db.query('DELETE FROM servers WHERE id=$1 AND user_id=$2', [serverId, userId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Server not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete server error:', err);
    res.status(500).json({ error: 'Failed to delete server' });
  }
});

module.exports = router;