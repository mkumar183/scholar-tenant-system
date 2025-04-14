import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTenantsData } from '@/hooks/useTenantsData';
import { createTenant, NewTenantForm } from '@/services/tenantsService';
import TenantsList from '@/components/tenants/TenantsList';
import TenantSearch from '@/components/tenants/TenantSearch';
import AddTenantDialog from '@/components/tenants/AddTenantDialog';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const Tenants = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { tenants, setTenants, isLoading, fetchTenants } = useTenantsData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState<NewTenantForm>({
    name: '',
    description: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const handleAddTenant = async () => {
    // Store the current auth session to restore it after tenant creation
    const { data: currentSession } = await supabase.auth.getSession();
    
    const createdTenant = await createTenant(newTenant);
    
    if (createdTenant) {
      toast.success('Tenant created successfully');
      setTenants([...tenants, createdTenant]);
      setIsAddDialogOpen(false);
      setNewTenant({
        name: '',
        description: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
      });
      
      // If the session was changed, restore the original session
      if (currentSession?.session) {
        await supabase.auth.setSession(currentSession.session);
      }
      
      // Stay on the dashboard page after tenant creation
      navigate('/dashboard');
    }
  };

  const handleTenantDeleted = () => {
    // No-op function (removed delete functionality)
  };

  if (user?.role !== 'superadmin') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Only superadmins can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Tenants</h1>
          <TenantSearch 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        </div>
        <AddTenantDialog
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          newTenant={newTenant}
          setNewTenant={setNewTenant}
          handleAddTenant={handleAddTenant}
        />
      </div>

      <TenantsList 
        isLoading={isLoading} 
        tenants={tenants} 
        searchTerm={searchTerm}
        onTenantDeleted={handleTenantDeleted}
      />
    </div>
  );
};

export default Tenants;
