import winston from 'winston'
import type { DatabaseStatus } from './db-checker.js'

// Create logs directory if it doesn't exist
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const logsDir = join(process.cwd(), 'logs')
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true })
}

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'daygrid-db-monitor' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true
    }),
    // Write error logs to error.log
    new winston.transports.File({
      filename: join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Separate file for database status logs
    new winston.transports.File({
      filename: join(logsDir, 'db-status.log'),
      level: 'info',
      maxsize: 10485760, // 10MB
      maxFiles: 15,
      tailable: true
    })
  ]
})

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export class LoggerService {
  static logStatusCheck(status: DatabaseStatus) {
    const logData = {
      event: 'database_status_check',
      timestamp: status.lastChecked,
      isConnected: status.isConnected,
      connectionTime: status.connectionTime,
      supabaseUrl: status.details.supabaseUrl,
      isConfigured: status.details.isConfigured,
      tablesExist: status.details.tablesExist,
      userTable: status.details.userTable,
      tasksTable: status.details.tasksTable,
      error: status.error || null
    }

    if (status.isConnected) {
      logger.info('Database status check: CONNECTED', logData)
    } else {
      logger.error('Database status check: DISCONNECTED', logData)
    }
  }

  static logServiceStart() {
    logger.info('Database monitoring service started', {
      interval: process.env.CHECK_INTERVAL || '2 hours',
      nodeEnv: process.env.NODE_ENV || 'development'
    })
  }

  static logServiceStop() {
    logger.info('Database monitoring service stopped')
  }

  static logError(message: string, error: Error | unknown) {
    logger.error(message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    })
  }

  static logInfo(message: string, meta?: object) {
    logger.info(message, meta)
  }

  static logWarning(message: string, meta?: object) {
    logger.warn(message, meta)
  }

  // Alerting methods
  static async sendAlert(status: DatabaseStatus) {
    if (!status.isConnected) {
      logger.error('🚨 DATABASE CONNECTION ALERT 🚨', {
        alert: 'database_down',
        url: status.details.supabaseUrl,
        lastChecked: status.lastChecked,
        error: status.error
      })
      
      // Here you could integrate with external alerting systems
      // like Slack, Discord, Email, PagerDuty, etc.
      await this.notifyExternalSystems(status)
    }
  }

  private static async notifyExternalSystems(status: DatabaseStatus) {
    // Placeholder for external notifications
    // Example: Slack webhook, Email service, etc.
    
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        // Implementation for Slack notification would go here
        logger.info('Would send Slack alert for database down')
      } catch (error) {
        logger.error('Failed to send Slack alert', { error })
      }
    }
  }
}