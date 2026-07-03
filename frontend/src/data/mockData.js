export const currentUser = { initial: 'S', name: 'Shweta More', email: 'shweta@example.com' }

export const summaryStats = {
  totalServers: { value: 24, trend: 'up', change: '+2', changeLabel: 'this week' },
  online: { value: 21, trend: 'up', change: '+1', changeLabel: 'today' },
  criticalAlerts: { value: 3, trend: 'up', change: '+1', changeLabel: 'last 24h' },
  averageCpu: { value: '67%', trend: 'down', change: '-4%', changeLabel: 'vs yesterday' },
}

export const cpuHistory = [
  { time: '00:00', cpu: 38 }, { time: '02:00', cpu: 44 }, { time: '04:00', cpu: 41 }, { time: '06:00', cpu: 52 },
  { time: '08:00', cpu: 60 }, { time: '10:00', cpu: 72 }, { time: '12:00', cpu: 69 }, { time: '14:00', cpu: 76 },
  { time: '16:00', cpu: 64 }, { time: '18:00', cpu: 58 }, { time: '20:00', cpu: 54 }, { time: '22:00', cpu: 47 },
]

export const totalResourceUsage = 74
export const resourceUsage = [
  { name: 'CPU', value: 67, color: '#8b6cfd' },
  { name: 'Memory', value: 78, color: '#3b82f6' },
  { name: 'Disk', value: 62, color: '#f59e0b' },
  { name: 'Network', value: 39, color: '#10b981' },
]

export const recentAlerts = [
  { id: 1, severity: 'critical', title: 'CPU Spike', badge: 'Critical', description: 'api-prod-01 exceeded 95% CPU', time: '2m ago' },
  { id: 2, severity: 'warning', title: 'Memory Warning', badge: 'Warning', description: 'db-replica-2 memory above 80%', time: '10m ago' },
  { id: 3, severity: 'info', title: 'Backup Completed', badge: 'Info', description: 'nightly backup completed successfully', time: '25m ago' },
]

export const connectedServers = [
  { id: 1, name: 'api-prod-01', provider: 'AWS', status: 'Online', ip: '10.10.1.22', cpu: 72, memory: 68, uptime: '12d 4h' },
  { id: 2, name: 'db-primary', provider: 'GCP', status: 'Warning', ip: '10.10.2.10', cpu: 64, memory: 84, uptime: '35d 9h' },
  { id: 3, name: 'cache-node-01', provider: 'Azure', status: 'Online', ip: '10.10.3.5', cpu: 39, memory: 51, uptime: '7d 3h' },
  { id: 4, name: 'worker-batch-03', provider: 'AWS', status: 'Offline', ip: '10.10.4.18', cpu: null, memory: null, uptime: null },
]