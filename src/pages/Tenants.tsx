
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTenantsData } from '@/hooks/useTenantsData';
import { createTenant, NewTenantForm } from '@/services/tenantsService';
import TenantsList from '@/components/tenants/TenantsList';
import TenantSearch from '@/components/tenants/TenantSearch';
import AddTenantDialog from '@/components/tenants/AddTenantDialog';

const Tenants = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { tenants, setTenants, isLoading } = useTenantsData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState<NewTenantForm>({
    name: '',
    description: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const handleAddTenant = async () => {
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
    }
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
      />
    </div>
  );
};

export default Tenants;
