
import { useState } from 'react';
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

// Mock data
const MOCK_TENANTS = [
  {
    id: 'tenant-1',
    name: 'City School District',
    description: 'Public school district serving the metropolitan area',
    schoolCount: 12,
    adminName: 'John Doe',
    adminEmail: 'admin@cityschools.edu',
  },
  {
    id: 'tenant-2',
    name: 'County Education Board',
    description: 'County-wide educational administration',
    schoolCount: 8,
    adminName: 'Jane Smith',
    adminEmail: 'jane@countyedu.org',
  },
  {
    id: 'tenant-3',
    name: 'Private Academy Group',
    description: 'Network of private educational institutions',
    schoolCount: 5,
    adminName: 'Robert Johnson',
    adminEmail: 'robert@academygroup.com',
  },
  {
    id: 'tenant-4',
    name: 'Charter Schools Alliance',
    description: 'Alliance of charter schools with innovative programs',
    schoolCount: 3,
    adminName: 'Sarah Williams',
    adminEmail: 'sarah@charterschools.org',
  },
];

const Tenants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState(MOCK_TENANTS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: '',
    description: '',
    adminName: '',
    adminEmail: '',
  });

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTenant = () => {
    const id = `tenant-${tenants.length + 1}`;
    const newTenantData = {
      ...newTenant,
      id,
      schoolCount: 0,
    };
    
    setTenants([...tenants, newTenantData]);
    setNewTenant({
      name: '',
      description: '',
      adminName: '',
      adminEmail: '',
    });
    setIsAddDialogOpen(false);
    toast.success('Tenant added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
              <DialogDescription>
                Create a new tenant group for schools
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="tenant-name">Tenant Name</Label>
                <Input
                  id="tenant-name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tenant-description">Description</Label>
                <Input
                  id="tenant-description"
                  value={newTenant.description}
                  onChange={(e) => setNewTenant({...newTenant, description: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="admin-name">Admin Name</Label>
                <Input
                  id="admin-name"
                  value={newTenant.adminName}
                  onChange={(e) => setNewTenant({...newTenant, adminName: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={newTenant.adminEmail}
                  onChange={(e) => setNewTenant({...newTenant, adminEmail: e.target.value})}
                  className="mt-1"
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
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">{tenant.name}</CardTitle>
              <CardDescription className="line-clamp-2 h-10">
                {tenant.description}
              </CardDescription>
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
      
      {filteredTenants.length === 0 && (
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
