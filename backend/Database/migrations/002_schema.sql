-- ================================
-- Extensions
-- ================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================
-- Profiles (App user data)
-- ================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{
        "working_hours": { "start": 9, "end": 17 },
        "default_task_duration": 60,
        "notifications": {
            "task_reminders": true,
            "day_start": true,
            "deadline_alerts": true
        },
        "theme": "system"
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================
-- Tasks
-- ================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    priority INT NOT NULL DEFAULT 1 CHECK (priority BETWEEN 1 AND 10),
    duration INT NOT NULL CHECK (duration > 0),
    type TEXT NOT NULL DEFAULT 'regular'
        CHECK (type IN ('regular','meeting','class','appointment','deadline','commitment')),
    scheduled_time BIGINT,
    completed BOOLEAN DEFAULT false,
    failed BOOLEAN DEFAULT false,
    abandoned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================
-- Days
-- ================================
CREATE TABLE days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'planning'
        CHECK (status IN ('planning','active','completed')),
    start_time TIME,
    end_time TIME,
    has_high_priority_task BOOLEAN DEFAULT false,
    high_priority_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date)
);

-- ================================
-- Task Logs (denormalized for RLS safety)
-- ================================
CREATE TABLE task_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    action TEXT NOT NULL
        CHECK (action IN ('created','updated','completed','failed','abandoned','scheduled','rescheduled')),
    previous_state JSONB,
    new_state JSONB,
    hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ================================
-- Indexes
-- ================================
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_scheduled_time ON tasks(scheduled_time);
CREATE INDEX idx_days_user_id ON days(user_id);
CREATE INDEX idx_days_date ON days(date);
CREATE INDEX idx_task_logs_user_id ON task_logs(user_id);

-- ================================
-- Updated-at Trigger (namespaced, safe)
-- ================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tasks_updated
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_days_updated
BEFORE UPDATE ON days
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ================================
-- Enable RLS
-- ================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE days ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;

-- ================================
-- RLS Policies (Ownership-based, safe)
-- ================================
CREATE POLICY "Users manage own profile"
ON profiles
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users manage own tasks"
ON tasks
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own days"
ON days
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own logs"
ON task_logs
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
