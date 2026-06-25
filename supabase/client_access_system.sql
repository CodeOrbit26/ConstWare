-- 1. Update sites table with client access columns
ALTER TABLE sites 
  ADD COLUMN IF NOT EXISTS client_access_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS client_access_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS client_name TEXT,
  ADD COLUMN IF NOT EXISTS client_phone TEXT,
  ADD COLUMN IF NOT EXISTS client_email TEXT,
  ADD COLUMN IF NOT EXISTS client_access_views INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS client_last_accessed_at TIMESTAMPTZ;

-- 2. Create client access logs table
CREATE TABLE IF NOT EXISTS client_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  client_access_id TEXT NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT
);

-- 3. Create index for performance
CREATE INDEX IF NOT EXISTS idx_sites_client_access_id 
  ON sites(client_access_id);

-- 4. Create helper function for view increment
CREATE OR REPLACE FUNCTION increment_client_views(site_id_input UUID)
RETURNS void AS $$
  UPDATE sites 
  SET client_access_views = COALESCE(client_access_views, 0) + 1,
      client_last_accessed_at = NOW()
  WHERE id = site_id_input;
$$ LANGUAGE sql SECURITY DEFINER;
