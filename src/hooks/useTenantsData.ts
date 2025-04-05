
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TenantType } from '@/types/tenant.types';

export const useTenantsData = () => {
  const [tenants, setTenants] = useState<TenantType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTenants = async () => {
    try {
      // First fetch the tenants
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*');

      if (tenantsError) throw tenantsError;

      // Then fetch the schools count for each tenant
      const tenantsWithSchoolCounts = await Promise.all(
        tenantsData.map(async (tenant) => {
          const { count, error: schoolsError } = await supabase
            .from('schools')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenant.id);

          if (schoolsError) {
            console.error('Error fetching schools count:', schoolsError);
            return {
              ...tenant,
              schoolCount: 0
            };
          }

          return {
            id: tenant.id,
            name: tenant.name,
            description: tenant.description,
            schoolCount: count || 0,
            adminName: tenant.admin_name,
            adminEmail: tenant.admin_email
          };
        })
      );

      setTenants(tenantsWithSchoolCounts);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast.error('Failed to fetch tenants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  return { tenants, setTenants, isLoading, fetchTenants };
};
