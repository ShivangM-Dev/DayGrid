import crypto from 'crypto'
import { Task, TaskLog } from '@/types'

export function generateHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

export function verifyTaskLogIntegrity(log: TaskLog): boolean {
  const dataToHash = JSON.stringify({
    taskId: log.taskId,
    action: log.action,
    timestamp: log.timestamp.toISOString(),
    previousState: log.previousState,
    newState: log.newState,
  })
  
  const computedHash = generateHash(dataToHash)
  return computedHash === log.hash
}

export function createTaskLog(
  taskId: string,
  action: TaskLog['action'],
  timestamp: Date,
  previousState?: Partial<Task>,
  newState?: Partial<Task>
): TaskLog {
  const logData = {
    taskId,
    action,
    timestamp: timestamp.toISOString(),
    previousState,
    newState,
  }
  
  const hash = generateHash(JSON.stringify(logData))
  
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    taskId,
    action,
    timestamp,
    previousState,
    newState,
    hash,
  }
}

export function validateTaskTransition(
  task: Task,
  action: TaskLog['action'],
  previousState?: Partial<Task>,
  newState?: Partial<Task>
): { valid: boolean; reason?: string } {
  switch (action) {
    case 'created':
      if (previousState) {
        return { valid: false, reason: 'Created action should not have previous state' }
      }
      return { valid: true }
      
    case 'completed':
      if (task.completed) {
        return { valid: false, reason: 'Task is already completed' }
      }
      if (task.failed || task.abandoned) {
        return { valid: false, reason: 'Cannot complete a failed or abandoned task' }
      }
      return { valid: true }
      
    case 'failed':
      if (task.failed) {
        return { valid: false, reason: 'Task is already failed' }
      }
      if (task.completed) {
        return { valid: false, reason: 'Cannot fail a completed task' }
      }
      return { valid: true }
      
    case 'abandoned':
      if (task.abandoned) {
        return { valid: false, reason: 'Task is already abandoned' }
      }
      if (task.completed) {
        return { valid: false, reason: 'Cannot abandon a completed task' }
      }
      return { valid: true }
      
    case 'scheduled':
      if (!newState?.scheduledTime && newState?.scheduledTime !== 0) {
        return { valid: false, reason: 'Scheduled action must include scheduled time' }
      }
      return { valid: true }
      
    case 'rescheduled':
      if (previousState?.scheduledTime === undefined) {
        return { valid: false, reason: 'Rescheduled action must have previous scheduled time' }
      }
      if (newState?.scheduledTime === undefined) {
        return { valid: false, reason: 'Rescheduled action must include new scheduled time' }
      }
      return { valid: true }
      
    case 'updated':
      return { valid: true }
      
    default:
      return { valid: false, reason: 'Unknown action type' }
  }
}

export function detectAnomalousPattern(logs: TaskLog[]): {
  hasAnomalies: boolean
  anomalies: string[]
} {
  const anomalies: string[] = []
  
  // Check for rapid state changes
  for (let i = 1; i < logs.length; i++) {
    const currentLog = logs[i]
    const previousLog = logs[i - 1]
    
    const timeDiff = currentLog.timestamp.getTime() - previousLog.timestamp.getTime()
    
    // If less than 1 second between logs, suspicious
    if (timeDiff < 1000) {
      anomalies.push(`Rapid state change detected for task ${currentLog.taskId}`)
    }
  }
  
  // Check for impossible state transitions
  const taskLogs = logs.reduce((acc, log) => {
    if (!acc[log.taskId]) {
      acc[log.taskId] = []
    }
    acc[log.taskId].push(log)
    return acc
  }, {} as Record<string, TaskLog[]>)
  
  Object.values(taskLogs).forEach((taskLogs) => {
    taskLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    
    let hasCompleted = false
    let hasFailed = false
    let hasAbandoned = false
    
    for (const log of taskLogs) {
      switch (log.action) {
        case 'completed':
          if (hasFailed || hasAbandoned) {
            anomalies.push(`Task ${log.taskId} completed after being failed/abandoned`)
          }
          hasCompleted = true
          break
        case 'failed':
          if (hasCompleted) {
            anomalies.push(`Task ${log.taskId} failed after being completed`)
          }
          hasFailed = true
          break
        case 'abandoned':
          if (hasCompleted) {
            anomalies.push(`Task ${log.taskId} abandoned after being completed`)
          }
          hasAbandoned = true
          break
      }
    }
  })
  
  return {
    hasAnomalies: anomalies.length > 0,
    anomalies,
  }
}

export function createEncryptedState(data: any, secretKey: string): string {
  const algorithm = 'aes-256-gcm'
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(algorithm, secretKey)
  cipher.setAAD(Buffer.from('daygrid-state'))
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return JSON.stringify({
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  })
}

export function decryptState(encryptedData: string, secretKey: string): any {
  try {
    const { encrypted, iv, authTag } = JSON.parse(encryptedData)
    const algorithm = 'aes-256-gcm'
    
    const decipher = crypto.createDecipher(algorithm, secretKey)
    decipher.setAAD(Buffer.from('daygrid-state'))
    decipher.setAuthTag(Buffer.from(authTag, 'hex'))
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return JSON.parse(decrypted)
  } catch (error) {
    throw new Error('Failed to decrypt state: Invalid data or key')
  }
}