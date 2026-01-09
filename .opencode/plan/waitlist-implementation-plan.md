# DayGrid Waitlist System Implementation Plan

## 🚀 Overview
Comprehensive waitlist system using Supabase for Google OAuth authentication and custom email management, with phased rollout and position-based access control.

## 📋 Current State Assessment
- ✅ Next.js 16.1.1 with App Router
- ✅ Supabase fully configured (auth, database, RLS)
- ✅ Google OAuth implementation working
- ✅ Waitlist UI exists with form validation
- ✅ TypeScript + Zod + React Hook Form
- ✅ Professional UI (shadcn/ui + Tailwind CSS)

## 🎯 Chosen Strategy
- **Phased Rollout**: Start simple, enhance gradually
- **Custom Email Solution**: Supabase Edge Functions + templates
- **Position-Based Access**: First-come, first-served with transparency

---

## 📊 Database Schema Extensions

### New Tables

```sql
-- Waitlist entries table
CREATE TABLE waitlist_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    signup_method VARCHAR(20) DEFAULT 'email' CHECK (signup_method IN ('email', 'google_oauth')),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    position INTEGER NOT NULL,
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES waitlist_entries(id),
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'invited', 'joined', 'skipped')),
    access_granted_at TIMESTAMP WITH TIME ZONE,
    invited_at TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email tracking table
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    waitlist_entry_id UUID REFERENCES waitlist_entries(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL, -- 'welcome', 'verification', 'access_granted', 'status_update'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waitlist settings table (for admin control)
CREATE TABLE waitlist_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    current_position INTEGER DEFAULT 1,
    total_invited INTEGER DEFAULT 0,
    daily_invite_limit INTEGER DEFAULT 50,
    auto_invite_enabled BOOLEAN DEFAULT FALSE,
    estimated_wait_days INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes for Performance
```sql
CREATE INDEX idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX idx_waitlist_position ON waitlist_entries(position);
CREATE INDEX idx_waitlist_status ON waitlist_entries(status);
CREATE INDEX idx_waitlist_signup_method ON waitlist_entries(signup_method);
CREATE INDEX idx_email_logs_entry_id ON email_logs(waitlist_entry_id);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
```

### RLS Policies
```sql
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_settings ENABLE ROW LEVEL SECURITY;

-- Public can insert waitlist entries
CREATE POLICY "Public can create waitlist entries" ON waitlist_entries FOR INSERT WITH CHECK (true);

-- Users can view their own waitlist entry
CREATE POLICY "Users can view own waitlist entry" ON waitlist_entries FOR SELECT USING (auth.uid()::text = user_id::text);

-- Service role can manage everything
CREATE POLICY "Service role full access waitlist" ON waitlist_entries FOR ALL USING (auth.role() = 'service_role');
```

---

## 🔄 Implementation Phases

### Phase 1: Enhanced Waitlist Foundation (Week 1-2)

#### Database Migration
1. Create migration file with new tables
2. Set up RLS policies and indexes
3. Create TypeScript types for new schema
4. Add seed data for waitlist settings

#### Enhanced Waitlist Form
```typescript
// src/components/main-application/waitlist/enhanced-waitlist-form.tsx
- Integrate Google OAuth button alongside existing form
- Add signup method selection
- Implement referral code input
- Enhanced validation for both methods
- Loading states and error handling
```

#### Backend API Routes
```typescript
// src/app/api/waitlist/route.ts
- POST /api/waitlist: Create new entry (email/OAuth)
- GET /api/waitlist/position: Check current position
- POST /api/waitlist/verify: Email verification
```

### Phase 2: Custom Email System (Week 3-4)

#### Supabase Edge Functions
```typescript
// supabase/functions/send-waitlist-email/index.ts
- Email sending with professional templates
- Personalized content generation
- Email tracking and analytics
- Template management system
```

#### Email Templates
```typescript
// Email Templates
1. Welcome & Position Confirmation
2. Email Verification
3. Access Granted Invitation
4. Status Update (monthly)
5. Referral Notification
```

#### Email Service Integration
```typescript
// src/lib/email-service.ts
- Template engine
- Send grid integration
- Tracking functionality
- Bounce handling
```

### Phase 3: OAuth Integration Enhancement (Week 5-6)

#### Modified OAuth Flow
```typescript
// src/app/auth/callback/route.ts
- Enhanced to create waitlist entries
- Link OAuth profiles to waitlist
- Automatic email verification
- Priority positioning logic
```

#### Waitlist Management Components
```typescript
// src/components/admin/waitlist-management/
- Dashboard with analytics
- Entry status management
- Bulk email sending
- Position management
- Export functionality
```

### Phase 4: Management & Automation (Week 7-8)

#### Admin Dashboard
```typescript
// src/app/admin/waitlist/page.tsx
- Waitlist statistics and metrics
- Entry management interface
- Email campaign management
- Automation settings
- User segmentation
```

#### Automation System
```typescript
// src/lib/waitlist-automation.ts
- Daily batch processing
- Automatic access granting
- Email scheduling
- Referral reward system
- Analytics tracking
```

---

## 🛠️ Technical Implementation Details

### File Structure
```
src/
├── app/
│   ├── api/
│   │   ├── waitlist/
│   │   │   ├── route.ts              # Main waitlist API
│   │   │   ├── position/route.ts     # Position check
│   │   │   └── verify/route.ts       # Email verification
│   │   └── admin/
│   │       └── waitlist/
│   │           ├── route.ts           # Admin management API
│   │           └── invite/route.ts   # Send invitations
│   ├── admin/
│   │   └── waitlist/
│   │       └── page.tsx              # Admin dashboard
│   └── waitlist/
│       ├── page.tsx                  # Enhanced waitlist page
│       └── success/
│           └── [position]/page.tsx   # Success page with position
├── components/
│   ├── main-application/
│   │   └── waitlist/
│   │       ├── enhanced-waitlist-form.tsx
│   │       ├── oauth-button.tsx
│   │       └── referral-input.tsx
│   └── admin/
│       └── waitlist/
│           ├── dashboard.tsx
│           ├── entry-list.tsx
│           └── email-campaign.tsx
├── lib/
│   ├── waitlist/
│   │   ├── types.ts                  # Waitlist TypeScript types
│   │   ├── api.ts                    # Waitlist API functions
│   │   ├── email-service.ts          # Email management
│   │   └── automation.ts             # Automation logic
│   └── email/
│       ├── templates.ts              # Email templates
│       └── tracking.ts               # Email tracking
└── hooks/
    ├── use-waitlist.ts               # Waitlist hooks
    └── use-oauth-waitlist.ts         # OAuth integration
```

### Key Components

#### Enhanced Waitlist Form
```typescript
interface WaitlistFormData {
  name: string;
  email: string;
  referralCode?: string;
  signupMethod: 'email' | 'google_oauth';
}

interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  position: number;
  status: 'waiting' | 'invited' | 'joined' | 'skipped';
  signupMethod: 'email' | 'google_oauth';
  emailVerified: boolean;
  createdAt: Date;
}
```

#### Email Service
```typescript
interface EmailTemplate {
  type: 'we
