# DayGrid Application Architecture Documentation

## Overview

DayGrid is a task management and daily planning application built as a backend-focused system with database services, security layers, validation schemas, and monitoring capabilities. The application follows a microservices architecture with clear separation of concerns.

## Project Structure

```
DayGrid/backend/
├── animations/              # Animation utilities (GSAP-based)
├── Database/               # Database management and migrations
├── db-monitor-microservice/ # Database monitoring service
├── security/               # Security and cryptography utilities
├── server/                 # Server configuration (Supabase)
└── validations/            # Data validation schemas
```

## Core Components

### 1. Database Layer (`Database/`)

**Technology Stack:**
- PostgreSQL with Supabase
- Custom migration system using Node.js/pg
- Row Level Security (RLS) enabled

**Key Tables:**
- `profiles`: User data and preferences
- `tasks`: Core task management with states
- `days`: Daily planning tracking
- `task_logs`: Immutable audit trail
- `waitlist`: Early user registration

**Migration System:**
- Custom TypeScript migration runner (`migrate.ts`)
- SQL-based migrations in `migrations/` directory
- Version-controlled with tracking table

### 2. Database Monitoring Service (`db-monitor-microservice/`)

**Purpose:** Microservice that monitors database connectivity and health every 2 hours

**Key Features:**
- Express-based health check server
- Winston logging with structured output
- Configurable check intervals
- Graceful shutdown handling
- Health endpoint at `/health`

**Architecture:**
- `DatabaseStatusChecker`: Connection validation
- `HealthCheckServer`: HTTP health endpoint
- `LoggerService`: Centralized logging
- `ConfigService`: Configuration management

### 3. Security Layer (`security/`)

**Components:**

#### `crypto.ts`
- Hash generation (SHA-256)
- Task log integrity verification
- State transition validation
- Anomaly detection patterns
- Encryption/decryption utilities (AES-256-GCM)

#### `immutable-logger.ts`
- Singleton pattern logger
- Cryptographically verified task state changes
- Comprehensive audit trail
- Anomaly detection
- Export/import functionality

**Security Features:**
- Cryptographic hash verification for all state changes
- Invalid transition prevention (completed → failed, etc.)
- Rapid change detection (<1 second threshold)
- Immutable logging with integrity checks

### 4. Validation Layer (`validations/`)

**Technology:** Zod schemas for runtime validation

**Key Schemas:**
- `taskSchema`: Complete task validation
- `createTaskSchema`: Task creation validation
- `scheduleTaskSchema`: Task scheduling validation
- `updateTaskSchema`: Task update validation
- `taskActionSchema`: Task state actions
- `daySchema`: Daily planning validation

**Validation Rules:**
- Task titles: 1-200 characters
- Priority: 1-10 scale
- Duration: 0.5-8 hours
- Task types: regular, meeting, class, appointment, deadline, commitment
- Scheduled times: 0-23 hours

### 5. Server Configuration (`server/`)

**Supabase Integration:**
- Server-side client configuration
- Service role authentication
- Cookie-based auth support (future)
- Environment-based configuration

### 6. Animation Layer (`animations/`)

**Timeline Animations (`timeline.ts`):**
- GSAP-based task animations
- Entrance, drag, drop, completion effects
- Error state animations
- Staggered entrance capabilities
- Timeline management utilities

**Transitions (`transitions.ts`):**
- Framer Motion style transitions
- Slide, scale, fade effects
- Direction-based animations

## Data Flow Architecture

### Task Lifecycle Flow

1. **Task Creation**
   - Validation via Zod schemas
   - Security logging with cryptographic hash
   - Database insertion with user context
   - RLS policy enforcement

2. **Task Scheduling**
   - Time validation (0-23 hours)
   - State transition verification
   - Immutable logging of schedule changes
   - Audit trail creation

3. **Task State Changes**
   - Security validation (crypto.ts)
   - Transition rule enforcement
   - Hash verification
   - Anomaly detection

4. **Database Operations**
   - Supabase client with RLS
   - User-scoped queries
   - Transaction support
   - Automatic timestamp updates

### Security Flow

1. **Authentication**
   - Supabase Auth integration
   - JWT token validation
   - User context establishment

2. **Authorization**
   - Row Level Security policies
   - User ownership verification
   - Admin role support for waitlist

3. **Audit & Integrity**
   - Cryptographic hash generation
   - State transition validation
   - Anomaly pattern detection
   - Immutable logging system

### Monitoring Flow

1. **Health Checks**
   - Database connectivity validation
   - Table existence verification
   - Response time monitoring
   - Structured logging output

2. **Alert System**
   - Connection failure detection
   - Automatic alert generation
   - Health endpoint availability
   - Graceful degradation handling

## Technology Stack

### Backend
- **Database:** PostgreSQL via Supabase
- **Language:** TypeScript/Node.js
- **Security:** Custom crypto + Supabase Auth
- **Validation:** Zod schemas
- **Monitoring:** Express + Winston
- **Migrations:** Custom Node.js runner

### Security & Reliability
- **Cryptography:** Node.js crypto module (SHA-256, AES-256-GCM)
- **Authentication:** Supabase Auth with JWT
- **Authorization:** Row Level Security (RLS)
- **Audit Trail:** Immutable cryptographic logging
- **Monitoring:** Health checks + structured logging

### Development
- **Build Tools:** TypeScript compiler, tsx
- **Package Management:** npm
- **Environment:** dotenv for configuration
- **Animations:** GSAP library

## Key Design Patterns

### 1. Microservices Architecture
- Separate database monitoring service
- Clear module boundaries
- Independent deployment capabilities

### 2. Immutable Logging
- Cryptographic hash verification
- Tamper-evident audit trails
- Singleton pattern for logger

### 3. Row Level Security
- Database-level access control
- User-scoped data access
- Admin role exceptions

### 4. Schema-First Validation
- Runtime validation with Zod
- Type safety throughout
- Composable validation schemas

### 5. Event-Driven Architecture
- Task state change events
- Comprehensive logging
- Anomaly detection triggers

## Security Considerations

### Data Protection
- All user data isolated by RLS
- Cryptographic audit trails
- Hash verification for integrity
- No plaintext logging of sensitive data

### Access Control
- JWT-based authentication
- User ownership verification
- Admin role separation
- Service role for backend operations

### Monitoring & Detection
- Anomalous pattern detection
- Rapid change alerts
- Integrity verification failures
- Connection monitoring

## Deployment Architecture

### Database
- Supabase-hosted PostgreSQL
- Automated migrations
- RLS policies enforced
- Real-time capabilities available

### Services
- Database monitoring as separate service
- Health check endpoints
- Graceful shutdown handling
- Structured logging output

### Configuration
- Environment-based configuration
- Service role secrets
- Database connection strings
- Monitoring intervals

## Future Extensibility

### Scalability
- Microservice architecture supports scaling
- Database monitoring independent
- Clear module boundaries
- Type-safe interfaces

### Features
- Frontend integration points ready
- Real-time updates via Supabase
- Animation system for UI
- Comprehensive audit trail

### Monitoring
- Additional health checks
- Performance metrics
- Custom alerting
- Dashboard integration

This architecture provides a solid foundation for a secure, scalable task management application with comprehensive audit capabilities and robust monitoring systems.