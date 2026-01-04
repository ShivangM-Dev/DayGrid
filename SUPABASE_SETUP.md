# Supabase Integration Guide for DayGrid

## 🚀 Quick Setup Guide

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Connect to GitHub or create account
4. Create a new project:
   - Organization: Your organization name
   - Project Name: `daygrid` or similar
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Wait for project setup (2-3 minutes)

### 2. Get Supabase Credentials

After project creation, go to:
- **Project Settings** → **API**
- Copy these values:
  ```bash
  Project URL: https://your-project-id.supabase.co
  Project API Key (anon public): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

### 3. Set Environment Variables

Create `.env.local` in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Create Database Tables

Run these SQL queries in your Supabase **SQL Editor**:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{
    "working_hours": {"start": 9, "end": 17},
    "default_task_duration": 1,
    "notifications": {
      "task_reminders": true,
      "day_start": true,
      "deadline_alerts": true
    },
    "theme": "system"
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 10),
  duration INTEGER NOT NULL CHECK (duration > 0),
  type TEXT NOT NULL CHECK (type IN ('regular', 'meeting', 'class', 'appointment', 'deadline', 'commitment')),
  scheduled_time INTEGER CHECK (scheduled_time >= 0 AND scheduled_time <= 23),
  completed BOOLEAN DEFAULT FALSE,
  failed BOOLEAN DEFAULT FALSE,
  abandoned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

-- Days table
CREATE TABLE days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  has_high_priority_task BOOLEAN DEFAULT FALSE,
  high_priority_task_id UUID REFERENCES tasks(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own days" ON days
  FOR ALL USING (auth.uid() = user_id);

-- Task logs for security auditing
CREATE TABLE task_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'completed', 'failed', 'abandoned', 'scheduled', 'rescheduled')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  previous_state JSONB,
  new_state JSONB,
  hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task logs" ON task_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM days 
      WHERE days.id = task_logs.day_id 
      AND days.user_id = auth.uid()
    )
  );

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_days_updated_at BEFORE UPDATE ON days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Configure Authentication

In Supabase Dashboard:

1. Go to **Authentication** → **Settings**
2. Configure these settings:
   - **Site URL**: `http://localhost:3000` (development)
   - **Redirect URLs**: `http://localhost:3000/auth/callback`
   - **Enable email confirmations**: Off (for development)

3. Go to **Authentication** → **Providers**
   - Enable **Email** provider
   - Configure email settings (or use Supabase's built-in email)

### 6. Update Auth Context

The current auth context is already configured to work with Supabase! Just ensure your environment variables are set and it will automatically switch from mock to real authentication.

### 7. Test the Connection

```bash
# Stop any running dev server
# Set your environment variables in .env.local
pnpm dev

# Visit http://localhost:3000
# Try logging in or signing up
```

## 🔧 Advanced Configuration

### Real-time Subscriptions

For real-time updates to tasks and days:

```typescript
// Example: Add to your task context
const supabase = createClient()

useEffect(() => {
  const channel = supabase
    .channel('tasks-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user?.id}`
      },
      (payload) => {
        // Handle real-time updates
        console.log('Task changed:', payload)
        // Update local state accordingly
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [user?.id])
```

### Server-side Auth (for API routes)

```typescript
// Example for protected API routes
import { supabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data: { user }, error } = await supabaseServer.auth.getUser()
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // User is authenticated, proceed with request
  return NextResponse.json({ user })
}
```

## 🚀 Deployment Considerations

### For Production:

1. **Environment Variables**: Set in your hosting platform
2. **Row Level Security**: Ensure all policies are correctly configured
3. **Database Backups**: Enable automatic backups in Supabase
4. **Custom Domain**: Configure custom domain for authentication
5. **Email Provider**: Configure a proper email service (SendGrid, etc.)

### Vercel Example:

```bash
# Set environment variables in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_key
```

## 🔒 Security Best Practices

1. **Always use RLS** on all user-facing tables
2. **Never expose service role key** to client-side code
3. **Validate data** before inserting (use Zod schemas)
4. **Use server-side operations** for sensitive operations
5. **Monitor auth logs** for suspicious activity

## 🧪 Testing Supabase Connection

```typescript
// Create a test file to verify connection
import { createClient } from '@/lib/supabase/client'

export async function testSupabaseConnection() {
  try {
    const supabase = createClient()
    
    // Test simple query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .single()
    
    if (error) throw error
    
    console.log('✅ Supabase connection successful!')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}
```

## 📊 Migration from Mock to Real Data

When you're ready to migrate from localStorage to Supabase:

1. **Back up current data**: Export localStorage data
2. **Create migration script**: Insert existing users, tasks, days
3. **Update hooks**: Modify useTasks, useDayState to use Supabase
4. **Test thoroughly**: Ensure all CRUD operations work correctly

The current hooks already have the structure in place - they just need the Supabase queries implemented.

---

Your DayGrid application is now ready to use Supabase! The existing codebase is designed to automatically detect Supabase credentials and switch from mock to real authentication seamlessly.