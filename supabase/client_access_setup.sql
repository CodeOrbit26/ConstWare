-- 1. Update sites table with client access columns
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS client_phone TEXT,
ADD COLUMN IF NOT EXISTS client_email TEXT,
ADD COLUMN IF NOT EXISTS client_access_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS client_access_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS client_access_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS client_last_accessed_at TIMESTAMP WITH TIME ZONE;

-- 2. Create client access logs table
CREATE TABLE IF NOT EXISTS client_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  access_id TEXT NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- 3. Create helper function for view increment (optional but recommended)
CREATE OR REPLACE FUNCTION increment_client_views(site_row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE sites 
  SET client_access_views = COALESCE(client_access_views, 0) + 1,
      client_last_accessed_at = NOW()
  WHERE id = site_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
