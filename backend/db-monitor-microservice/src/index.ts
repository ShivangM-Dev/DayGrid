import { DatabaseStatusChecker } from './db-checker.js'
import { LoggerService } from './logger.js'
import { HealthCheckServer } from './health-server.js'
import { loadConfig, validateConfig, type Config } from './config.js'

export class DatabaseMonitorService {
  private dbChecker: DatabaseStatusChecker
  private healthServer: HealthCheckServer
  private config: Config
  private intervalId: NodeJS.Timeout | null = null
  private isRunning: boolean = false

  constructor(config: Config) {
    this.config = config
    this.dbChecker = new DatabaseStatusChecker()
    this.healthServer = new HealthCheckServer(config)
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      LoggerService.logWarning('Service is already running')
      return
    }

    try {
      LoggerService.logServiceStart()
      
      // Start health check server
      await this.healthServer.start()
      
      // Perform initial check
      await this.performDatabaseCheck()
      
      // Schedule periodic checks
      this.intervalId = setInterval(
        () => this.performDatabaseCheck(),
        this.config.service.checkInterval
      )

      this.isRunning = true
      
      LoggerService.logInfo('Database monitoring service started successfully', {
        checkInterval: this.config.service.checkInterval,
        healthCheckUrl: `http://${this.config.healthCheck.host}:${this.config.healthCheck.port}/health`
      })

    } catch (error) {
      LoggerService.logError('Failed to start database monitoring service', error)
      throw error
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      LoggerService.logWarning('Service is not running')
      return
    }

    try {
      // Clear the interval
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }

      // Stop health check server
      await this.healthServer.stop()
      
      this.isRunning = false
      
      LoggerService.logServiceStop()

    } catch (error) {
      LoggerService.logError('Failed to stop database monitoring service', error)
      throw error
    }
  }

  private async performDatabaseCheck(): Promise<void> {
    try {
      LoggerService.logInfo('Performing scheduled database status check')
      
      const status = await this.dbChecker.checkDatabaseConnection()
      
      // Log the check result
      LoggerService.logStatusCheck(status)
      
      // Send alert if disconnected
      if (!status.isConnected) {
        await LoggerService.sendAlert(status)
      }

      LoggerService.logInfo('Database status check completed', {
        isConnected: status.isConnected,
        connectionTime: status.connectionTime,
        tablesExist: status.details.tablesExist
      })

    } catch (error) {
      LoggerService.logError('Database status check failed', error)
    }
  }

  // Manual check method (can be triggered externally)
  async checkNow(): Promise<void> {
    await this.performDatabaseCheck()
  }

  // Get service status
  getStatus(): { isRunning: boolean; config: Config } {
    return {
      isRunning: this.isRunning,
      config: this.config
    }
  }
}

// Main execution function
async function main() {
  try {
    // Load and validate configuration
    const config = loadConfig()
    const validation = validateConfig(config)

    if (!validation.isValid) {
      LoggerService.logError('Configuration validation failed', new Error(validation.errors.join(', ')))
      process.exit(1)
    }

    // Create and start the service
    const service = new DatabaseMonitorService(config)

    // Handle graceful shutdown
    const gracefulShutdown = async () => {
      LoggerService.logInfo('Received shutdown signal, stopping service gracefully')
      try {
        await service.stop()
        process.exit(0)
      } catch (error) {
        LoggerService.logError('Error during graceful shutdown', error)
        process.exit(1)
      }
    }

    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)
    process.on('SIGUSR2', gracefulShutdown) // For nodemon

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      LoggerService.logError('Uncaught exception', error)
      process.exit(1)
    })

    process.on('unhandledRejection', (reason, promise) => {
      LoggerService.logError('Unhandled promise rejection', new Error(String(reason)))
      process.exit(1)
    })

    // Start the service
    await service.start()

    // Keep the process alive
    LoggerService.logInfo('Database monitoring service is running. Press Ctrl+C to stop.')

  } catch (error) {
    LoggerService.logError('Failed to start database monitoring service', error)
    process.exit(1)
  }
}

// Run the service if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Failed to start service:', error)
    process.exit(1)
  })
}

export { main }