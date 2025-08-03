// Simple debug logging utility that can export logs to a file
class DebugLogger {
  constructor() {
    this.logs = []
    this.isEnabled = true
  }

  log(...args) {
    if (!this.isEnabled) return

    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level: 'log',
      message: args
        .map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
        .join(' '),
    }

    this.logs.push(logEntry)
    console.log(...args)
  }

  error(...args) {
    if (!this.isEnabled) return

    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level: 'error',
      message: args
        .map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
        .join(' '),
    }

    this.logs.push(logEntry)
    console.error(...args)
  }

  warn(...args) {
    if (!this.isEnabled) return

    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level: 'warn',
      message: args
        .map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
        .join(' '),
    }

    this.logs.push(logEntry)
    console.warn(...args)
  }

  clear() {
    this.logs = []
  }

  exportToFile(filename = 'debug-logs.txt') {
    const content = this.logs
      .map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`)
      .join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  getLogs() {
    return this.logs
  }

  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }
}

// Create a global instance
const debugLogger = new DebugLogger()

// Make it available globally for easy access
if (typeof window !== 'undefined') {
  window.debugLogger = debugLogger
}

export default debugLogger
