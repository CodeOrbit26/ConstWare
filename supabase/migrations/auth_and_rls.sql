-- ============================================================
-- CONSTWARE: Authentication & Row Level Security Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Auto-create profile when a new user signs up via Supabase Auth
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, company_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Enable Row Level Security on ALL tables
-- ============================================================

-- PROFILES: Users can only read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- SITES: Users can only CRUD their own sites
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own sites" ON sites;
DROP POLICY IF EXISTS "Users can create own sites" ON sites;
DROP POLICY IF EXISTS "Users can update own sites" ON sites;
DROP POLICY IF EXISTS "Users can delete own sites" ON sites;
CREATE POLICY "Users can view own sites" ON sites
  FOR SELECT USING (contractor_id = auth.uid());
CREATE POLICY "Users can create own sites" ON sites
  FOR INSERT WITH CHECK (contractor_id = auth.uid());
CREATE POLICY "Users can update own sites" ON sites
  FOR UPDATE USING (contractor_id = auth.uid());
CREATE POLICY "Users can delete own sites" ON sites
  FOR DELETE USING (contractor_id = auth.uid());

-- BLUEPRINT_ANALYSES: Users can only access their own analyses
ALTER TABLE blueprint_analyses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own analyses" ON blueprint_analyses;
DROP POLICY IF EXISTS "Users can create own analyses" ON blueprint_analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON blueprint_analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON blueprint_analyses;
-- Allow public read for shared analyses via share_token
DROP POLICY IF EXISTS "Public can view shared analyses" ON blueprint_analyses;
CREATE POLICY "Users can view own analyses" ON blueprint_analyses
  FOR SELECT USING (contractor_id = auth.uid());
CREATE POLICY "Public can view shared analyses" ON blueprint_analyses
  FOR SELECT USING (share_token IS NOT NULL);
CREATE POLICY "Users can create own analyses" ON blueprint_analyses
  FOR INSERT WITH CHECK (contractor_id = auth.uid());
CREATE POLICY "Users can update own analyses" ON blueprint_analyses
  FOR UPDATE USING (contractor_id = auth.uid());
CREATE POLICY "Users can delete own analyses" ON blueprint_analyses
  FOR DELETE USING (contractor_id = auth.uid());

-- CLIENT_ACCESS_LOGS: Access through site ownership
ALTER TABLE client_access_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own site access logs" ON client_access_logs;
DROP POLICY IF EXISTS "Anyone can create access logs" ON client_access_logs;
CREATE POLICY "Users can view own site access logs" ON client_access_logs
  FOR SELECT USING (
    site_id IN (SELECT id FROM sites WHERE contractor_id = auth.uid())
  );
CREATE POLICY "Anyone can create access logs" ON client_access_logs
  FOR INSERT WITH CHECK (true);

-- WORKERS: All authenticated users can manage workers (workers are shared resource)
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can manage workers" ON workers;
CREATE POLICY "Authenticated users can manage workers" ON workers
  FOR ALL USING (auth.uid() IS NOT NULL);

-- SITE_WORKERS: Access through site ownership
ALTER TABLE site_workers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own site workers" ON site_workers;
CREATE POLICY "Users can manage own site workers" ON site_workers
  FOR ALL USING (
    site_id IN (SELECT id FROM sites WHERE contractor_id = auth.uid())
  );

-- ATTENDANCE: Access through site ownership
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own site attendance" ON attendance;
CREATE POLICY "Users can manage own site attendance" ON attendance
  FOR ALL USING (
    site_id IN (SELECT id FROM sites WHERE contractor_id = auth.uid())
  );

-- ADVANCES: Access through site ownership
ALTER TABLE advances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own site advances" ON advances;
CREATE POLICY "Users can manage own site advances" ON advances
  FOR ALL USING (
    site_id IN (SELECT id FROM sites WHERE contractor_id = auth.uid())
  );

-- WAGES: Access through site ownership
ALTER TABLE wages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own site wages" ON wages;
CREATE POLICY "Users can manage own site wages" ON wages
  FOR ALL USING (
    site_id IN (SELECT id FROM sites WHERE contractor_id = auth.uid())
  );

-- EXPENSES: Access through site ownership
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own site expenses" ON expenses;
CREATE POLICY "Users can manage own site expenses" ON expenses
  FOR ALL USING (
    site_id IN (SELECT id FROM sites WHERE contractor_id = auth.uid())
  );
