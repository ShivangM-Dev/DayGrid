import { useState, useEffect } from 'react'
import { Task, TaskLog } from '@/types'
import { immutableLogger } from '@/backend/security/immutable-logger'

export function useSecurityMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [alerts, setAlerts] = useState<string[]>([])
  const [logCount, setLogCount] = useState(0)

  useEffect(() => {
    if (!isMonitoring) {
      return
    }

    const checkInterval = setInterval(() => {
      const logs = immutableLogger.getLogs()
      const validation = immutableLogger.validateAllLogs()
      const anomalyDetection = immutableLogger.detectAnomalies()

      // Update log count
      setLogCount(logs.length)

      // Check for validation errors
      if (!validation.valid) {
        const newAlerts = validation.invalidLogs.map(log => `🔒 Log Integrity Alert: ${log}`)
        setAlerts(prev => [...prev, ...newAlerts])
      }

      // Check for anomalies
      if (anomalyDetection.hasAnomalies) {
        const newAlerts = anomalyDetection.anomalies.map(anomaly => `⚠️ Anomaly Detected: ${anomaly}`)
        setAlerts(prev => [...prev, ...newAlerts])
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(checkInterval)
  }, [isMonitoring])

  const clearAlerts = () => {
    setAlerts([])
  }

  const disableMonitoring = () => {
    setIsMonitoring(false)
    immutableLogger.disable()
  }

  const enableMonitoring = () => {
    setIsMonitoring(true)
    immutableLogger.enable()
  }

  const getLogSummary = () => {
    const logs = immutableLogger.getLogs()
    const summary = {
      total: logs.length,
      created: logs.filter(l => l.action === 'created').length,
      updated: logs.filter(l => l.action === 'updated').length,
      completed: logs.filter(l => l.action === 'completed').length,
      failed: logs.filter(l => l.action === 'failed').length,
      abandoned: logs.filter(l => l.action === 'abandoned').length,
      scheduled: logs.filter(l => l.action === 'scheduled').length,
      rescheduled: logs.filter(l => l.action === 'rescheduled').length,
    }
    return summary
  }

  return {
    isMonitoring,
    alerts,
    logCount,
    clearAlerts,
    enableMonitoring,
    disableMonitoring,
    getLogSummary,
    validateLogs: () => immutableLogger.validateAllLogs(),
    detectAnomalies: () => immutableLogger.detectAnomalies(),
    exportLogs: () => immutableLogger.exportLogs(),
  }
}