
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const deleteTenant = async (tenantId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', tenantId);
      
    if (error) {
      console.error('Error deleting tenant:', error);
      toast.error(`Failed to delete tenant: ${error.message}`);
      return false;
    }
    return true;
  } catch (error: any) {
    console.error('Exception deleting tenant:', error);
    toast.error(`Unexpected error: ${error.message || 'Unknown error'}`);
    return false;
  }
};

export const addTenant = async (tenantData: {
  name: string;
  description?: string;
  adminName?: string;
  adminEmail?: string;
  adminPassword?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // First, insert the tenant record
    const { data: tenantInsertData, error: tenantInsertError } = await supabase
      .from('tenants')
      .insert([
        {
          name: tenantData.name,
          description: tenantData.description || null,
          admin_name: tenantData.adminName || null,
          admin_email: tenantData.adminEmail || null,
        },
      ])
      .select()
      .single();

    if (tenantInsertError) {
      throw tenantInsertError;
    }

    // If admin email and password are provided, create an admin user
    if (tenantData.adminEmail && tenantData.adminPassword) {
      // Create the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tenantData.adminEmail,
        password: tenantData.adminPassword,
        options: {
          data: {
            role: 'tenant_admin',
          },
        },
      });

      if (authError) {
        // Clean up the tenant if user creation fails
        await supabase.from('tenants').delete().eq('id', tenantInsertData.id);
        throw authError;
      }

      // Create the user profile and link to tenant
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user!.id,
          name: tenantData.adminName,
          role: 'tenant_admin',
          tenant_id: tenantInsertData.id,
        },
      ]);

      if (profileError) {
        // Clean up - we don't have a way to delete the auth user directly through the client
        await supabase.from('tenants').delete().eq('id', tenantInsertData.id);
        throw profileError;
      }

      // Update the tenant with the admin user ID
      const { error: updateError } = await supabase
        .from('tenants')
        .update({ admin_id: authData.user!.id })
        .eq('id', tenantInsertData.id);

      if (updateError) {
        throw updateError;
      }
    }

    return { success: true, id: tenantInsertData.id };
  } catch (error: any) {
    console.error('Error adding tenant:', error);
    return { success: false, error: error.message };
  }
};
