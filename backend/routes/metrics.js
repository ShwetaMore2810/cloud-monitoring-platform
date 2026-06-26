// backend/routes/metrics.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Get recent metrics for a server (paginated)
router.get('/history/:serverId', async (req, res) => {
  const userId = req.user?.userId;
  const serverId = parseInt(req.params.serverId, 10);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const limit = Math.min(100, parseInt(req.query.limit, 10) || 50);

  try {
    // Ensure user owns server
    const owner = await db.query('SELECT id FROM servers WHERE id=$1 AND user_id=$2', [serverId, userId]);
    if (owner.rowCount === 0) return res.status(404).json({ error: 'Server not found' });

    const result = await db.query(
      `SELECT id, collected_at, cpu, mem_total, mem_used, mem_free, mem_usage_percent, disk_filesystem, disk_size, disk_used, disk_available, disk_usage_percent, load1, load5, load15
       FROM metrics_history WHERE server_id=$1 ORDER BY collected_at DESC LIMIT $2`,
      [serverId, limit]
    );
    res.json({ history: result.rows });
  } catch (err) {
    console.error('Get metrics history error:', err);
    res.status(500).json({ error: 'Failed to fetch metrics history' });
  }
});

module.exports = router;