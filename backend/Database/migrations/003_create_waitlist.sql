-- ================================
-- Waitlist
-- ================================
CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    referral_source TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','accepted','rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================
-- Indexes
-- ================================
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_status ON waitlist(status);

-- ================================
-- Trigger
-- ================================
CREATE TRIGGER trg_waitlist_updated
BEFORE UPDATE ON waitlist
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ================================
-- Enable RLS
-- ================================
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- ================================
-- RLS Policies
-- ================================

-- Public signup (unauthenticated users)
CREATE POLICY "Public waitlist insert"
ON waitlist
FOR INSERT
WITH CHECK (true);

-- Admin access via JWT role claim
CREATE POLICY "Admins manage waitlist"
ON waitlist
USING (
    auth.jwt() ->> 'role' = 'admin'
);
