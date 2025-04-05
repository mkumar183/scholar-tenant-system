import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, School, Users, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const Tenants = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState<{
    id: string;
    name: string;
    description: string | null;
    schoolCount: number;
    adminName: string | null;
    adminEmail: string | null;
  }[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: '',
    description: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select(`
            *,
            schools:schools(count)
          `);

        if (error) throw error;

        setTenants(data.map(tenant => ({
          id: tenant.id,
          name: tenant.name,
          description: tenant.description,
          schoolCount: tenant.schools[0].count,
          adminName: tenant.admin_name,
          adminEmail: tenant.admin_email
        })));
      } catch (error) {
        console.error('Error fetching tenants:', error);
        toast.error('Failed to fetch tenants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleAddTenant = async () => {
    try {
      // 1. Create the tenant
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

      if (tenantError) throw tenantError;

      // 2. Create the tenant admin user
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

      if (authError) throw authError;

      // 3. Create the user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: newTenant.adminName,
          email: newTenant.adminEmail,
          role: 'tenant_admin',
          tenant_id: tenantData.id,
        });

      if (profileError) throw profileError;

      // 4. Update the tenant with the admin user ID
      const { error: updateError } = await supabase
        .from('tenants')
        .update({ admin_id: authData.user.id })
        .eq('id', tenantData.id);

      if (updateError) throw updateError;

      toast.success('Tenant created successfully');
      setIsAddDialogOpen(false);
      setNewTenant({
        name: '',
        description: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
      });

      // Refresh the tenants list
      const { data: updatedTenants, error: fetchError } = await supabase
        .from('tenants')
        .select(`
          *,
          schools:schools(count)
        `);

      if (fetchError) throw fetchError;

      setTenants(updatedTenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        description: tenant.description,
        schoolCount: tenant.schools[0].count,
        adminName: tenant.admin_name,
        adminEmail: tenant.admin_email
      })));
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast.error('Failed to create tenant');
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.adminName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
              <DialogDescription>
                Create a new tenant and set up their admin user.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tenant Name</Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder="Enter tenant name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTenant.description}
                  onChange={(e) => setNewTenant({ ...newTenant, description: e.target.value })}
                  placeholder="Enter tenant description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminName">Admin Name</Label>
                <Input
                  id="adminName"
                  value={newTenant.adminName}
                  onChange={(e) => setNewTenant({ ...newTenant, adminName: e.target.value })}
                  placeholder="Enter admin name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={newTenant.adminEmail}
                  onChange={(e) => setNewTenant({ ...newTenant, adminEmail: e.target.value })}
                  placeholder="Enter admin email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Admin Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={newTenant.adminPassword}
                  onChange={(e) => setNewTenant({ ...newTenant, adminPassword: e.target.value })}
                  placeholder="Enter admin password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTenant}>Create Tenant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTenants.map((tenant) => (
            <Card key={tenant.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{tenant.name}</CardTitle>
                <CardDescription>{tenant.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <School className="mr-1 h-4 w-4" />
                    <span>{tenant.schoolCount} Schools</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    <span>1 Admin</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium">{tenant.adminName}</p>
                  <p className="text-xs text-muted-foreground">{tenant.adminEmail}</p>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button size="sm">Manage</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!isLoading && filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <School className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No tenants found</h3>
          <p className="text-muted-foreground">Try adjusting your search or add a new tenant.</p>
        </div>
      )}
    </div>
  );
};

export default Tenants;
