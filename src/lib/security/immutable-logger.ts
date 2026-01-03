import { createTaskLog, validateTaskTransition, detectAnomalousPattern, verifyTaskLogIntegrity } from '@/lib/security/crypto'
import { Task, TaskLog, DayState } from '@/types'
import { useDayState } from '@/hooks/use-day-state'

export class ImmutableLogger {
  private static instance: ImmutableLogger
  private logs: TaskLog[] = []
  private isEnabled: boolean = true

  static getInstance(): ImmutableLogger {
    if (!ImmutableLogger.instance) {
      ImmutableLogger.instance = new ImmutableLogger()
    }
    return ImmutableLogger.instance
  }

  enable(): void {
    this.isEnabled = true
  }

  disable(): void {
    this.isEnabled = false
  }

  private addLog(log: TaskLog): void {
    if (!this.isEnabled) {
      throw new Error('Logging is disabled')
    }
    
    // Verify log integrity before adding
    if (!verifyTaskLogIntegrity(log)) {
      throw new Error('Log integrity verification failed')
    }
    
    this.logs.push(log)
  }

  logTaskCreation(task: Task): void {
    const log = createTaskLog(
      task.id,
      'created',
      new Date(),
      undefined,
      task
    )
    
    this.addLog(log)
  }

  logTaskUpdate(taskId: string, previousState: Partial<Task>, newState: Partial<Task>): void {
    const log = createTaskLog(
      taskId,
      'updated',
      new Date(),
      previousState,
      newState
    )
    
    this.addLog(log)
  }

  logTaskCompletion(task: Task): void {
    const validation = validateTaskTransition(task, 'completed')
    if (!validation.valid) {
      throw new Error(`Invalid task completion: ${validation.reason}`)
    }

    const log = createTaskLog(
      task.id,
      'completed',
      new Date(),
      { completed: false, failed: false, abandoned: false },
      { completed: true }
    )
    
    this.addLog(log)
  }

  logTaskFailure(task: Task): void {
    const validation = validateTaskTransition(task, 'failed')
    if (!validation.valid) {
      throw new Error(`Invalid task failure: ${validation.reason}`)
    }

    const log = createTaskLog(
      task.id,
      'failed',
      new Date(),
      { completed: false, failed: false, abandoned: false },
      { failed: true }
    )
    
    this.addLog(log)
  }

  logTaskAbandonment(task: Task): void {
    const validation = validateTaskTransition(task, 'abandoned')
    if (!validation.valid) {
      throw new Error(`Invalid task abandonment: ${validation.reason}`)
    }

    const log = createTaskLog(
      task.id,
      'abandoned',
      new Date(),
      { completed: false, failed: false, abandoned: false },
      { abandoned: true }
    )
    
    this.addLog(log)
  }

  logTaskScheduling(taskId: string, previousTime: number | undefined, newTime: number): void {
    const log = createTaskLog(
      taskId,
      previousTime === undefined ? 'scheduled' : 'rescheduled',
      new Date(),
      { scheduledTime: previousTime },
      { scheduledTime: newTime }
    )
    
    this.addLog(log)
  }

  getLogs(): TaskLog[] {
    return [...this.logs] // Return a copy to prevent external modification
  }

  getLogsForTask(taskId: string): TaskLog[] {
    return this.logs.filter(log => log.taskId === taskId)
  }

  getLogsForDay(date: string): TaskLog[] {
    // In a real implementation, this would filter by day
    // For now, return all logs
    return [...this.logs]
  }

  clearLogs(): void {
    if (this.isEnabled) {
      throw new Error('Cannot clear logs while logging is enabled')
    }
    this.logs = []
  }

  validateAllLogs(): { valid: boolean; invalidLogs: string[] } {
    const invalidLogs: string[] = []
    
    this.logs.forEach((log, index) => {
      if (!verifyTaskLogIntegrity(log)) {
        invalidLogs.push(`Log at index ${index} for task ${log.taskId}`)
      }
    })
    
    return {
      valid: invalidLogs.length === 0,
      invalidLogs,
    }
  }

  detectAnomalies(): { hasAnomalies: boolean; anomalies: string[] } {
    return detectAnomalousPattern(this.logs)
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  importLogs(logsJson: string): void {
    if (this.isEnabled) {
      throw new Error('Cannot import logs while logging is enabled')
    }
    
    try {
      const importedLogs: TaskLog[] = JSON.parse(logsJson)
      
      // Validate all imported logs
      for (const log of importedLogs) {
        if (!verifyTaskLogIntegrity(log)) {
          throw new Error(`Invalid log for task ${log.taskId}`)
        }
      }
      
      this.logs = importedLogs
    } catch (error) {
      throw new Error(`Failed to import logs: ${error}`)
    }
  }
}

// Export singleton instance
export const immutableLogger = ImmutableLogger.getInstance()