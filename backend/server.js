require('dotenv').config()
const express = require('express')
const cors = require('cors')

require('./db')
const authenticate = require('./middleware/authenticate')

const authRouter = require('./routes/auth')
const serversRouter = require('./routes/servers')
const metricsRouter = require('./routes/metrics')

const app = express()
const port = process.env.PORT || 3000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
)
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/servers', authenticate, serversRouter)
app.use('/api/metrics', authenticate, metricsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`${new Date().toISOString()} - Server started`)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})