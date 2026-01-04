# Database Migration Guide

This folder contains the database schema and migration scripts for DayGrid.

## Files

- `schema.sql` - Complete database schema with tables, indexes, triggers, and RLS policies
- `migrate.ts` - TypeScript migration script with CLI interface
- `package.json` - Dependencies for the migration script

## Setup

1. Install dependencies:
   ```bash
   cd backend/Database
   npm install
   ```

2. Set environment variables:
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

## Usage

### Apply Initial Schema
```bash
npm run migrate:init
# or
tsx migrate.ts init
```

### Check Migration Status
```bash
npm run migrate:status
# or
tsx migrate.ts status
```

### Reset Database (⚠️ Destructive)
```bash
npm run migrate:reset
# or
tsx migrate.ts reset --force
```

## Database Schema

The schema includes:

### Tables
- `users` - User profiles and preferences
- `tasks` - Individual tasks with scheduling and priority
- `days` - Daily planning status and metadata
- `task_logs` - Audit trail for all task changes
- `migrations` - Migration tracking

### Features
- Row Level Security (RLS) for data isolation
- Automatic timestamp updates
- Proper foreign key constraints
- Optimized indexes
- JSONB for flexible preferences storage

## Security

All tables have Row Level Security enabled with policies ensuring users can only access their own data. The migration script requires a service role key to execute schema changes.