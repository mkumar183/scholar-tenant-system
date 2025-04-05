-- 1. Drop all existing policies
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'tenants'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.tenants', pol.policyname);
    END LOOP;
END $$;

-- 2. Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- 3. Create new policies

-- Allow all users to read tenants (for dropdowns, etc.)
CREATE POLICY "tenants_select_policy" ON public.tenants
    FOR SELECT USING (true);

-- Allow superadmins full access
CREATE POLICY "tenants_superadmin_policy" ON public.tenants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'superadmin'
        )
    );

-- Allow tenant admins to read their own tenant
CREATE POLICY "tenants_tenant_admin_policy" ON public.tenants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'tenant_admin'
            AND tenant_id = tenants.id
        )
    );

-- 4. Grant necessary permissions
GRANT ALL ON public.tenants TO authenticated;
GRANT ALL ON public.tenants TO service_role;