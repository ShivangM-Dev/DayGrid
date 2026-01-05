import express from 'express'
import cors from 'cors'
import { DatabaseStatusChecker } from './db-checker.js'
import type { DatabaseStatus } from './db-checker.js'
import { LoggerService } from './logger.js'
import type { Config } from './config.js'

export class HealthCheckServer {
  private app: express.Application
  private dbChecker: DatabaseStatusChecker
  private config: Config
  private server: any

  constructor(config: Config) {
    this.config = config
    this.app = express()
    this.dbChecker = new DatabaseStatusChecker()
    
    this.setupMiddleware()
    this.setupRoutes()
  }

  private setupMiddleware() {
    this.app.use(cors())
    this.app.use(express.json())
    
    // Request logging middleware
    this.app.use((req, res, next) => {
      LoggerService.logInfo(`Health check request: ${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })
      next()
    })
  }

  private setupRoutes() {
    // Main health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const status: DatabaseStatus = await this.dbChecker.checkDatabaseConnection()
        
        LoggerService.logInfo('Health check endpoint accessed', {
          isConnected: status.isConnected,
          responseTime: status.connectionTime
        })

        res.status(status.isConnected ? 200 : 503).json({
          status: status.isConnected ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          service: 'daygrid-db-monitor',
          database: {
            connected: status.isConnected,
            lastChecked: status.lastChecked,
            connectionTime: status.connectionTime,
            error: status.error || null,
            details: status.details
          }
        })
      } catch (error) {
        LoggerService.logError('Health check failed', error)
        
        res.status(503).json({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          service: 'daygrid-db-monitor',
          error: 'Health check failed'
        })
      }
    })

    // Simple ping endpoint
    this.app.get('/ping', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: 'daygrid-db-monitor'
      })
    })

    // Service info endpoint
    this.app.get('/info', (req, res) => {
      res.json({
        service: 'daygrid-db-monitor',
        version: '1.0.0',
        description: 'Microservice to monitor DayGrid database status',
        config: {
          checkInterval: this.config.service.checkInterval,
          logLevel: this.config.service.logLevel,
          nodeEnv: this.config.service.nodeEnv,
          healthCheckPort: this.config.healthCheck.port,
          alertingEnabled: !!(this.config.alerting.slackWebhookUrl || this.config.alerting.emailEnabled)
        },
        timestamps: {
          startTime: new Date(Date.now() - process.uptime() * 1000).toISOString(),
          currentTime: new Date().toISOString(),
          uptime: process.uptime()
        }
      })
    })

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: ['/health', '/ping', '/info'],
        timestamp: new Date().toISOString()
      })
    })
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(
          this.config.healthCheck.port,
          this.config.healthCheck.host,
          () => {
            LoggerService.logInfo(`Health check server started`, {
              host: this.config.healthCheck.host,
              port: this.config.healthCheck.port,
              url: `http://${this.config.healthCheck.host}:${this.config.healthCheck.port}/health`
            })
            resolve()
          }
        )

        this.server.on('error', (error: Error) => {
          LoggerService.logError('Health check server failed to start', error)
          reject(error)
        })

        // Graceful shutdown handling
        process.on('SIGTERM', () => this.gracefulShutdown())
        process.on('SIGINT', () => this.gracefulShutdown())

      } catch (error) {
        LoggerService.logError('Failed to start health check server', error)
        reject(error)
      }
    })
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          LoggerService.logInfo('Health check server stopped')
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  private gracefulShutdown(): void {
    LoggerService.logInfo('Received shutdown signal, stopping health check server gracefully')
    this.stop().then(() => {
      process.exit(0)
    }).catch((error) => {
      LoggerService.logError('Error during graceful shutdown', error)
      process.exit(1)
    })
  }
}