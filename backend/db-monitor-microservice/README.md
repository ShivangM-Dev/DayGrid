# DayGrid Database Monitor Microservice

A standalone microservice that monitors the DayGrid database status every 2 hours and provides health check endpoints.

## Features

- **Automated Database Monitoring**: Checks database connection status every 2 hours (configurable)
- **Health Check Endpoints**: HTTP server for monitoring and integration
- **Comprehensive Logging**: Structured logging with file rotation
- **Alerting System**: Built-in support for alerts (Slack webhook ready)
- **Graceful Shutdown**: Clean shutdown handling
- **Configuration Management**: Environment-based configuration

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

3. **Test Database Connection**
   ```bash
   npm run test
   ```

4. **Start the Service**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## Environment Variables

### Required
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

### Optional
- `CHECK_INTERVAL`: Check interval in milliseconds (default: 7200000 = 2 hours)
- `LOG_LEVEL`: Logging level (default: 'info')
- `HEALTH_CHECK_PORT`: Health check server port (default: 3001)
- `HEALTH_CHECK_HOST`: Health check server host (default: 'localhost')
- `SLACK_WEBHOOK_URL`: Slack webhook URL for alerts
- `ALERT_EMAIL_ENABLED`: Enable email alerts (default: false)

## API Endpoints

### Health Check
- `GET /health` - Full health check with database status
- `GET /ping` - Simple ping endpoint
- `GET /info` - Service information and configuration

### Example Responses

#### Health Check
```json
{
  "status": "healthy",
  "timestamp": "2026-01-04T20:55:37.198Z",
  "uptime": 3600.123,
  "service": "daygrid-db-monitor",
  "database": {
    "connected": true,
    "lastChecked": "2026-01-04T20:55:37.198Z",
    "connectionTime": 485,
    "error": null,
    "details": {
      "supabaseUrl": "https://your-project.supabase.co",
      "isConfigured": true,
      "clientConfigured": true,
      "serverConfigured": true,
      "tablesExist": true,
      "userTable": true,
      "tasksTable": true
    }
  }
}
```

## Logs

The service creates structured logs in the `logs/` directory:

- `combined.log`: All logs with rotation (5MB max, 10 files)
- `error.log`: Error logs only (5MB max, 5 files)
- `db-status.log`: Database status logs only (10MB max, 15 files)

## Monitoring Integration

### Prometheus/Health Check
```bash
# Health check
curl http://localhost:3001/health

# Service info
curl http://localhost:3001/info
```

### Docker Integration
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

### Systemd Service
```ini
[Unit]
Description=DayGrid Database Monitor
After=network.target

[Service]
Type=simple
User=daygrid
WorkingDirectory=/opt/daygrid-db-monitor
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## Alerting

### Slack Integration
Set `SLACK_WEBHOOK_URL` to receive alerts when the database goes down.

### Custom Alerting
Extend the `LoggerService.notifyExternalSystems()` method in `src/logger.ts` to add custom alerting integrations.

## Configuration

All configuration is handled through environment variables. See `src/config.ts` for validation logic.

## Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Test database connection
npm run test
```

## Architecture

- **DatabaseStatusChecker**: Handles database connectivity testing
- **LoggerService**: Structured logging and alerting
- **HealthCheckServer**: HTTP server for health endpoints
- **DatabaseMonitorService**: Main service orchestration

## License

MIT