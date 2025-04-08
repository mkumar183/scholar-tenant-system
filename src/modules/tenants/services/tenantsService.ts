
import { supabase } from '@/lib/supabase';
import { TenantType } from '@/types/tenant.types';

export interface NewTenantForm {
  name: string;
  description: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export const fetchTenants = async (): Promise<TenantType[]> => {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching tenants:', error);
      throw error;
    }

    // Transform the data to include empty schoolCount if needed
    return data.map(tenant => ({
      ...tenant,
      schoolCount: tenant.schoolCount || 0
    })) as TenantType[];
  } catch (error) {
    console.error('Failed to fetch tenants:', error);
    throw error;
  }
};

export const createTenant = async (tenantData: NewTenantForm): Promise<TenantType | null> => {
  try {
    // First create the admin user in the auth service
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: tenantData.adminEmail,
      password: tenantData.adminPassword,
      options: {
        data: {
          full_name: tenantData.adminName,
          role: 'tenant_admin'
        }
      }
    });

    if (authError) {
      console.error('Error creating tenant admin user:', authError);
      throw authError;
    }

    // Get the user ID from the authentication response
    const adminId = authData.user?.id;

    if (!adminId) {
      throw new Error('Failed to get user ID after signup');
    }

    // Create the tenant record in the database
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .insert([
        {
          name: tenantData.name,
          description: tenantData.description,
          admin_id: adminId,
          admin_name: tenantData.adminName,
          admin_email: tenantData.adminEmail
        }
      ])
      .select()
      .single();

    if (tenantError) {
      console.error('Error creating tenant record:', tenantError);
      throw tenantError;
    }

    // Update the user's metadata with the tenant ID
    await supabase.auth.updateUser({
      data: {
        tenant_id: tenantData.id
      }
    });

    return {
      ...tenantData,
      schoolCount: 0
    } as TenantType;
  } catch (error) {
    console.error('Failed to create tenant:', error);
    return null;
  }
};

export const deleteTenant = async (tenantId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', tenantId);

    if (error) {
      console.error('Error deleting tenant:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete tenant:', error);
    return false;
  }
};
