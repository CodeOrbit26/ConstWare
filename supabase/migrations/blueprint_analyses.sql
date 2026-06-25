-- Migration: Create blueprint_analyses table
CREATE TABLE IF NOT EXISTS blueprint_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID REFERENCES auth.users(id),
  site_id UUID REFERENCES sites(id),
  blueprint_image_url TEXT,
  input_data JSONB DEFAULT '{}'::jsonb,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  interior_selections JSONB DEFAULT '{}'::jsonb,
  ai_interior_report JSONB DEFAULT '{}'::jsonb,
  total_civil_cost DECIMAL DEFAULT 0,
  total_interior_cost DECIMAL DEFAULT 0,
  grand_total DECIMAL DEFAULT 0,
  share_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for share tokens
CREATE INDEX IF NOT EXISTS idx_blueprint_share_token ON blueprint_analyses(share_token);

-- Index for contractor projects
CREATE INDEX IF NOT EXISTS idx_blueprint_contractor ON blueprint_analyses(contractor_id);
