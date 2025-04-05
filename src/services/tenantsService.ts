
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TenantType } from '@/types/tenant.types';

export interface NewTenantForm {
  name: string;
  description: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export const createTenant = async (newTenant: NewTenantForm): Promise<TenantType | null> => {
  try {
    console.log('Starting tenant creation process...');
    
    // 1. Create the tenant first (without admin_id since we don't have it yet)
    console.log('Creating tenant record...');
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: newTenant.name,
        description: newTenant.description,
        admin_name: newTenant.adminName,
        admin_email: newTenant.adminEmail,
      })
      .select()
      .single();

    if (tenantError) {
      console.error('Error creating tenant:', tenantError);
      throw tenantError;
    }
    console.log('Tenant created successfully:', tenantData);

    // 2. Create the tenant admin user
    console.log('Creating tenant admin user...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newTenant.adminEmail,
      password: newTenant.adminPassword,
      options: {
        data: {
          name: newTenant.adminName,
          role: 'tenant_admin',
          tenant_id: tenantData.id,
        },
      },
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }
    console.log('Auth user created successfully:', authData);

    // 3. Create the user profile
    console.log('Creating user profile...');
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: newTenant.adminName,
        role: 'tenant_admin',
        tenant_id: tenantData.id,
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      throw profileError;
    }
    console.log('User profile created successfully');

    // 4. Update the tenant with the admin user ID
    console.log('Updating tenant with admin ID...');
    const { error: updateError } = await supabase
      .from('tenants')
      .update({ admin_id: authData.user.id })
      .eq('id', tenantData.id);

    if (updateError) {
      console.error('Error updating tenant with admin ID:', updateError);
      throw updateError;
    }
    console.log('Tenant updated with admin ID successfully');

    // Return the created tenant with school count
    return {
      id: tenantData.id,
      name: tenantData.name,
      description: tenantData.description,
      schoolCount: 0,
      adminName: tenantData.admin_name,
      adminEmail: tenantData.admin_email
    };
  } catch (error) {
    console.error('Error in tenant creation process:', error);
    toast.error('Failed to create tenant. Check console for details.');
    return null;
  }
};

export const deleteTenant = async (tenantId: string): Promise<boolean> => {
  try {
    console.log('Deleting tenant with ID:', tenantId);
    
    // 1. Delete the tenant
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', tenantId);

    if (error) {
      console.error('Error deleting tenant:', error);
      toast.error('Failed to delete tenant');
      return false;
    }

    console.log('Tenant deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in tenant deletion process:', error);
    toast.error('Failed to delete tenant. Check console for details.');
    return false;
  }
};
