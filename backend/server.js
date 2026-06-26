// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { Client } = require('ssh2');

const db = require('./db'); 
const authenticate = require('./middleware/authenticate');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_ORIGIN
}));
app.use(express.json());

// Mount auth routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);
const serversRouter = require('./routes/servers');
const metricsRouter = require('./routes/metrics');
app.use('/api/servers', authenticate, serversRouter);   // all /api/servers routes require auth
app.use('/api/metrics', authenticate, metricsRouter);   // metrics history requires auth

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(os.tmpdir(), 'server-metrics-pemfiles');

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Create a unique filename with original extension
      const uniqueSuffix = crypto.randomBytes(16).toString('hex');
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  })
});

// Endpoint to fetch server metrics
// If you want the route public, remove `authenticate` below.
app.post('/api/fetch-metrics', authenticate, upload.single('pemFile'), async (req, res) => {
  console.log('Received request to fetch metrics');
  const { serverIp, username } = req.body;

  if (!serverIp) {
    console.error('Missing server IP');
    return res.status(400).json({ error: 'Server IP is required' });
  }

  if (!username) {
    console.error('Missing username');
    return res.status(400).json({ error: 'Username is required' });
  }

  if (!req.file) {
    console.error('Missing PEM file');
    return res.status(400).json({ error: 'PEM file is required' });
  }

  const pemFilePath = req.file.path;
  console.log(`PEM file saved at ${pemFilePath}`);

  // Set correct permissions for the PEM file
  try {
    fs.chmodSync(pemFilePath, 0o600);
    console.log('Set permissions to 0600 for PEM file');
  } catch (err) {
    console.error('Error setting PEM file permissions:', err);
    return res.status(500).json({ error: 'Failed to set permissions on PEM file' });
  }

  // Create SSH connection
  const conn = new Client();

  // Timeout for connection attempts (15 seconds)
  const connectionTimeout = setTimeout(() => {
    conn.end();
    try { fs.unlinkSync(pemFilePath); } catch (e) {}
    return res.status(504).json({ error: 'Connection timeout. Please check your server IP and ensure port 22 is open in your security group.' });
  }, 15000);

  conn.on('error', (err) => {
    console.error('SSH connection error:', err);
    clearTimeout(connectionTimeout);

    // Clean up the temporary file
    try {
      fs.unlinkSync(pemFilePath);
    } catch (e) {
      console.error('Error removing temp file:', e);
    }

    return res.status(500).json({
      error: 'SSH connection error',
      details: err.message,
      suggestions: [
        "Ensure your EC2 instance's security group allows SSH (port 22) connections",
        "Verify the username is correct (often 'ec2-user', 'ubuntu', or 'admin')",
        "Confirm the PEM file is the correct key for this instance",
        "Check if your instance is running"
      ]
    });
  });

  conn.on('ready', () => {
    console.log('SSH connection established');
    clearTimeout(connectionTimeout);

    const metrics = {};
    let completedCommands = 0;
    let commandErrors = 0;
    const totalCommands = 4;

    // Function to execute SSH commands and collect metrics
    const executeCommand = (command, metricKey, parser) => {
      console.log(`Executing command: ${command}`);
      conn.exec(command, (err, stream) => {
        if (err) {
          console.error(`Error executing command ${command}:`, err);
          metrics[metricKey] = { error: err.message };
          commandErrors++;
          checkCompletion();
          return;
        }

        let output = '';
        let errorOutput = '';

        stream.on('data', (data) => {
          output += data.toString();
        });

        stream.stderr.on('data', (data) => {
          errorOutput += data.toString();
          console.error(`stderr for ${command}:`, data.toString());
        });

        stream.on('close', (code) => {
          console.log(`Command ${command} completed with code ${code}`);

          if (code !== 0) {
            console.error(`Command failed with code ${code}:`, errorOutput);
            metrics[metricKey] = { error: errorOutput || `Command exited with code ${code}` };
            commandErrors++;
          } else {
            try {
              metrics[metricKey] = parser(output.trim());
              console.log(`Parsed ${metricKey} metrics:`, metrics[metricKey]);
            } catch (error) {
              console.error(`Error parsing ${metricKey} output:`, error);
              metrics[metricKey] = { error: error.message, raw: output.trim() };
              commandErrors++;
            }
          }

          checkCompletion();
        });
      });
    };

    // Function to check if all commands have completed
//     const checkCompletion = () => {
//       completedCommands++;
//       console.log(`Command completed: ${completedCommands}/${totalCommands}`);

//       if (completedCommands === totalCommands) {
//         conn.end();
//         console.log('All commands completed, closing connection');

//         // Clean up the temporary file
//         try {
//           fs.unlinkSync(pemFilePath);
//           console.log('Temporary PEM file removed');
//         } catch (e) {
//           console.error('Error removing temp file:', e);
//         }

//         if (commandErrors === totalCommands) {
//           return res.status(500).json({
//             error: 'Failed to execute commands on the server',
//             metrics,
//             suggestions: [
//               "The user account may not have sufficient permissions",
//               "Try with a different username (common ones: ec2-user, ubuntu, admin, root)",
//               "The server might be using a different Linux distribution than expected"
//             ]
//           });
//         }

//         // after metrics are ready and before res.json({ metrics });
// try {
//   const serverId = req.body.serverId ? parseInt(req.body.serverId, 10) : null;
//   if (serverId && req.user) {
//     // Ensure server belongs to user
//     const ownerRes = await require('./db').query('SELECT id FROM servers WHERE id=$1 AND user_id=$2', [serverId, req.user.userId]);
//     if (ownerRes.rowCount === 1) {
//       // Prepare values for insert
//       const m = metrics;
//       await require('./db').query(
//         `INSERT INTO metrics_history
//           (server_id, cpu, mem_total, mem_used, mem_free, mem_usage_percent, disk_filesystem, disk_size, disk_used, disk_available, disk_usage_percent, load1, load5, load15)
//          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
//         [
//           serverId,
//           m.cpu?.usage ?? null,
//           m.memory?.total ?? null,
//           m.memory?.used ?? null,
//           m.memory?.free ?? null,
//           m.memory?.usagePercent ?? null,
//           m.disk?.filesystem ?? null,
//           m.disk?.size ?? null,
//           m.disk?.used ?? null,
//           m.disk?.available ?? null,
//           m.disk?.usagePercent ?? null,
//           m.load?.load1 ?? null,
//           m.load?.load5 ?? null,
//           m.load?.load15 ?? null
//         ]
//       );
//     } else {
//       console.log('Not saving metrics: server not owned by user or not found');
//     }
//   }
// } catch (e) {
//   console.error('Error saving metrics to DB:', e);
// }

//         res.json({ metrics });
//       }
//     };

    // Collect CPU metrics - using a more compatible command
    
  const checkCompletion = () => { completedCommands++; console.log(`Command completed: ${completedCommands}/${totalCommands}`);
  if (completedCommands === totalCommands) { conn.end(); console.log('All commands completed, closing connection');
    // Clean up the temporary file
try {
  fs.unlinkSync(pemFilePath);
  console.log('Temporary PEM file removed');
} catch (e) {
  console.error('Error removing temp file:', e);
}

// Prepare the normal response logic
const sendResponse = () => {
  if (commandErrors === totalCommands) {
    return res.status(500).json({
      error: 'Failed to execute commands on the server',
      metrics,
      suggestions: [
        "The user account may not have sufficient permissions",
        "Try with a different username (common ones: ec2-user, ubuntu, admin, root)",
        "The server might be using a different Linux distribution than expected"
      ]
    });
  }
  return res.json({ metrics });
};

// If a serverId was provided and user is authenticated, try to save the metrics
const serverId = req.body?.serverId ? parseInt(req.body.serverId, 10) : null;
if (serverId && req.user) {
  // Verify ownership, then insert metrics. Use promise chaining (no top-level await).
  db.query('SELECT id FROM servers WHERE id=$1 AND user_id=$2', [serverId, req.user.userId])
    .then((ownerRes) => {
      if (ownerRes.rowCount === 1) {
        const m = metrics;
        return db.query(
          `INSERT INTO metrics_history
            (server_id, cpu, mem_total, mem_used, mem_free, mem_usage_percent, disk_filesystem, disk_size, disk_used, disk_available, disk_usage_percent, load1, load5, load15)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
          [
            serverId,
            m.cpu?.usage ?? null,
            m.memory?.total ?? null,
            m.memory?.used ?? null,
            m.memory?.free ?? null,
            m.memory?.usagePercent ?? null,
            m.disk?.filesystem ?? null,
            m.disk?.size ?? null,
            m.disk?.used ?? null,
            m.disk?.available ?? null,
            m.disk?.usagePercent ?? null,
            m.load?.load1 ?? null,
            m.load?.load5 ?? null,
            m.load?.load15 ?? null
          ]
        );
      }
      // Server not owned or not found — resolve and do not save
      return Promise.resolve();
    })
    .then(() => {
      // Insert (or skip) finished — send response
      sendResponse();
    })
    .catch((e) => {
      console.error('Error saving metrics to DB:', e);
      // On DB error, still send response (do not block)
      sendResponse();
    });
} else {
  // No serverId or user -> just respond
  sendResponse();
}
} };
    
    executeCommand("top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'", 'cpu', (output) => {
      const usage = parseFloat(output);
      return { usage: isNaN(usage) ? 0 : usage };
    });

    // Collect memory metrics - more compatible version
    executeCommand("free | grep -i mem | awk '{print $2,$3,$4,$3*100/$2}'", 'memory', (output) => {
      const parts = output.trim().split(/\s+/);
      const total = parseInt(parts[0]);
      const used = parseInt(parts[1]);
      const free = parseInt(parts[2]);
      const usagePercent = parseFloat(parts[3]);

      return {
        total: Math.round(total / 1024), // Convert to MB
        used: Math.round(used / 1024),   // Convert to MB
        free: Math.round(free / 1024),   // Convert to MB
        usagePercent: Math.round(usagePercent * 100) / 100
      };
    });

    // Collect disk usage - more compatible version
    executeCommand("df -h / | tail -n 1 | awk '{print $1,$2,$3,$4,$5,$6}'", 'disk', (output) => {
      const parts = output.split(/\s+/);
      return {
        filesystem: parts[0],
        size: parts[1],
        used: parts[2],
        available: parts[3],
        usagePercent: parseInt(parts[4].replace('%', '')),
        mountPoint: parts[5]
      };
    });

    // Collect system load - more compatible version
    executeCommand("uptime | awk -F'[:,]' '{ print $4, $5, $6}'", 'load', (output) => {
      const loads = output.trim().split(/\s+/).map(parseFloat);
      return {
        load1: isNaN(loads[0]) ? 0 : loads[0],
        load5: isNaN(loads[1]) ? 0 : loads[1],
        load15: isNaN(loads[2]) ? 0 : loads[2]
      };
    });
  });

  // Connect to the server with better error handling
  try {
    console.log(`Attempting to connect to ${serverIp} as ${username}`);

    const privateKey = fs.readFileSync(pemFilePath);

    conn.connect({
      host: serverIp,
      port: 22,
      username: username,
      privateKey: privateKey,
      readyTimeout: 10000, // 10 seconds timeout for ready
      debug: (message) => console.log('SSH Debug:', message)
    });
  } catch (err) {
    console.error('Error initiating SSH connection:', err);
    clearTimeout(connectionTimeout);

    // Clean up the temporary file
    try {
      fs.unlinkSync(pemFilePath);
    } catch (e) {
      console.error('Error removing temp file:', e);
    }

    return res.status(500).json({
      error: 'Failed to initiate SSH connection',
      details: err.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`${new Date().toISOString()} - Server started`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});