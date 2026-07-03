const express = require('express')
const db = require('../db')
const fs = require('fs')
const path = require('path')
const os = require('os')
const crypto = require('crypto')
const multer = require('multer')
const { Client } = require('ssh2')

const router = express.Router()

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(os.tmpdir(), 'server-metrics-pemfiles')
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = crypto.randomBytes(16).toString('hex')
      cb(null, `${uniqueSuffix}${path.extname(file.originalname) || '.pem'}`)
    },
  }),
})

function runSshCommands({ host, username, privateKey }) {
  return new Promise((resolve, reject) => {
    const conn = new Client()
    const metrics = {}
    let completed = 0
    let errors = 0
    const total = 4

    const checkDone = () => {
      if (completed !== total) return
      conn.end()
      resolve({ metrics, errors, total })
    }

    const execute = (command, key, parser) => {
      conn.exec(command, (err, stream) => {
        if (err) {
          metrics[key] = { error: err.message }
          errors++
          completed++
          return checkDone()
        }

        let output = ''
        let errOut = ''

        stream.on('data', (d) => (output += d.toString()))
        stream.stderr.on('data', (d) => (errOut += d.toString()))
        stream.on('close', (code) => {
          if (code !== 0) {
            metrics[key] = { error: errOut || `Command exited with code ${code}` }
            errors++
          } else {
            try {
              metrics[key] = parser(output.trim())
            } catch (e) {
              metrics[key] = { error: e.message, raw: output.trim() }
              errors++
            }
          }
          completed++
          checkDone()
        })
      })
    }

    conn
      .on('ready', () => {
        execute(
          "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'",
          'cpu',
          (output) => {
            const usage = parseFloat(output)
            return { usage: isNaN(usage) ? 0 : Number(usage.toFixed(2)) }
          }
        )

        execute(
          "free | grep -i mem | awk '{print $2,$3,$4,$3*100/$2}'",
          'memory',
          (output) => {
            const parts = output.split(/\s+/)
            const total = parseInt(parts[0] || '0', 10)
            const used = parseInt(parts[1] || '0', 10)
            const free = parseInt(parts[2] || '0', 10)
            const usagePercent = parseFloat(parts[3] || '0')
            return {
              total: Math.round(total / 1024),
              used: Math.round(used / 1024),
              free: Math.round(free / 1024),
              usagePercent: Number((isNaN(usagePercent) ? 0 : usagePercent).toFixed(2)),
            }
          }
        )

        execute(
          "df -h / | tail -n 1 | awk '{print $1,$2,$3,$4,$5,$6}'",
          'disk',
          (output) => {
            const parts = output.split(/\s+/)
            return {
              filesystem: parts[0] || null,
              size: parts[1] || null,
              used: parts[2] || null,
              available: parts[3] || null,
              usagePercent: parseInt((parts[4] || '0').replace('%', ''), 10) || 0,
              mountPoint: parts[5] || '/',
            }
          }
        )

        execute(
          "uptime | awk -F'[:,]' '{ print $4, $5, $6}'",
          'load',
          (output) => {
            const loads = output.split(/\s+/).filter(Boolean).map(parseFloat)
            return {
              load1: isNaN(loads[0]) ? 0 : loads[0],
              load5: isNaN(loads[1]) ? 0 : loads[1],
              load15: isNaN(loads[2]) ? 0 : loads[2],
            }
          }
        )
      })
      .on('error', (err) => reject(err))
      .connect({
        host,
        port: 22,
        username,
        privateKey,
        readyTimeout: 15000,
      })
  })
}

// Fetch metrics for saved server by id + uploaded pem file
router.post('/fetch/:serverId', upload.single('pem'), async (req, res) => {
  const userId = req.user?.userId
  const serverId = parseInt(req.params.serverId, 10)

  if (!userId) return res.status(401).json({ error: 'Unauthorized' })
  if (!serverId) return res.status(400).json({ error: 'Invalid server id' })
  if (!req.file) return res.status(400).json({ error: 'PEM file is required (field name: pem)' })

  const pemFilePath = req.file.path

  try {
    fs.chmodSync(pemFilePath, 0o600)

    const s = await db.query(
      'SELECT id, name, host, username FROM servers WHERE id=$1 AND user_id=$2',
      [serverId, userId]
    )
    if (s.rowCount === 0) return res.status(404).json({ error: 'Server not found' })

    const server = s.rows[0]
    const privateKey = fs.readFileSync(pemFilePath)

    const { metrics, errors, total } = await runSshCommands({
      host: server.host,
      username: server.username,
      privateKey,
    })

    const isUp = errors < total

    await db.query(
      `INSERT INTO metrics_history
      (server_id,cpu,mem_total,mem_used,mem_free,mem_usage_percent,disk_filesystem,disk_size,disk_used,disk_available,disk_usage_percent,load1,load5,load15)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        serverId,
        metrics.cpu?.usage ?? null,
        metrics.memory?.total ?? null,
        metrics.memory?.used ?? null,
        metrics.memory?.free ?? null,
        metrics.memory?.usagePercent ?? null,
        metrics.disk?.filesystem ?? null,
        metrics.disk?.size ?? null,
        metrics.disk?.used ?? null,
        metrics.disk?.available ?? null,
        metrics.disk?.usagePercent ?? null,
        metrics.load?.load1 ?? null,
        metrics.load?.load5 ?? null,
        metrics.load?.load15 ?? null,
      ]
    )

    return res.json({
      server,
      metrics: {
        cpu: metrics.cpu?.usage ?? 0,
        mem_usage_percent: metrics.memory?.usagePercent ?? 0,
        disk_usage_percent: metrics.disk?.usagePercent ?? 0,
        is_up: isUp,
      },
      raw: metrics,
    })
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to fetch metrics',
      details: err.message,
    })
  } finally {
    try {
      fs.unlinkSync(pemFilePath)
    } catch (_) {}
  }
})

// Per-server history
router.get('/history/:serverId', async (req, res) => {
  const userId = req.user?.userId
  const serverId = parseInt(req.params.serverId, 10)
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const limit = Math.min(200, parseInt(req.query.limit, 10) || 50)

  try {
    const owner = await db.query('SELECT id FROM servers WHERE id=$1 AND user_id=$2', [serverId, userId])
    if (owner.rowCount === 0) return res.status(404).json({ error: 'Server not found' })

    const result = await db.query(
      `SELECT id, collected_at, cpu, mem_total, mem_used, mem_free, mem_usage_percent, disk_filesystem, disk_size, disk_used, disk_available, disk_usage_percent, load1, load5, load15
       FROM metrics_history
       WHERE server_id=$1
       ORDER BY collected_at DESC
       LIMIT $2`,
      [serverId, limit]
    )
    res.json({ history: result.rows })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch metrics history' })
  }
})

// All history for current user (all servers)
router.get('/history-all', async (req, res) => {
  const userId = req.user?.userId
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const limit = Math.min(1000, parseInt(req.query.limit, 10) || 300)

  try {
    const result = await db.query(
      `SELECT
        mh.id,
        mh.collected_at,
        mh.server_id,
        s.name AS server_name,
        s.host,
        s.username,
        mh.cpu,
        mh.mem_usage_percent,
        mh.disk_usage_percent
       FROM metrics_history mh
       JOIN servers s ON s.id = mh.server_id
       WHERE s.user_id = $1
       ORDER BY mh.collected_at DESC
       LIMIT $2`,
      [userId, limit]
    )
    res.json({ history: result.rows })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all history' })
  }
})

module.exports = router