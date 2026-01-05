export interface Config {
  database: {
    supabaseUrl: string
    supabaseAnonKey: string
    supabaseServiceKey: string
  }
  service: {
    checkInterval: number  // in milliseconds
    logLevel: string
    nodeEnv: string
  }
  healthCheck: {
    port: number
    host: string
  }
  alerting: {
    slackWebhookUrl?: string
    emailEnabled: boolean
    emailTo?: string
    emailFrom?: string
  }
}

export function loadConfig(): Config {
  const checkInterval = process.env.CHECK_INTERVAL 
    ? parseInt(process.env.CHECK_INTERVAL, 10)
    : 2 * 60 * 60 * 1000  // 2 hours default

  return {
    database: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    },
    service: {
      checkInterval,
      logLevel: process.env.LOG_LEVEL || 'info',
      nodeEnv: process.env.NODE_ENV || 'development'
    },
    healthCheck: {
      port: parseInt(process.env.HEALTH_CHECK_PORT || '3001', 10),
      host: process.env.HEALTH_CHECK_HOST || 'localhost'
    },
    alerting: {
      slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
      emailEnabled: process.env.ALERT_EMAIL_ENABLED === 'true',
      emailTo: process.env.ALERT_EMAIL_TO,
      emailFrom: process.env.ALERT_EMAIL_FROM
    }
  }
}

export function validateConfig(config: Config): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate database config
  if (!config.database.supabaseUrl) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required')
  }
  if (!config.database.supabaseServiceKey) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is required')
  }
  if (!config.database.supabaseAnonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }

  // Validate service config
  if (config.service.checkInterval < 60000) {
    errors.push('CHECK_INTERVAL must be at least 60000ms (1 minute)')
  }

  // Validate health check port
  if (isNaN(config.healthCheck.port) || config.healthCheck.port < 1 || config.healthCheck.port > 65535) {
    errors.push('HEALTH_CHECK_PORT must be a valid port number (1-65535)')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}