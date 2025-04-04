
-- Create tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  admin_name TEXT,
  admin_email TEXT
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Admin can see all tenants
CREATE POLICY "Admins can see all tenants" ON public.tenants
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Users can see their own tenant
CREATE POLICY "Users can see their own tenant" ON public.tenants
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID = id);

-- Only admins can insert/update/delete tenants
CREATE POLICY "Only admins can insert tenants" ON public.tenants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update tenants" ON public.tenants
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete tenants" ON public.tenants
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
