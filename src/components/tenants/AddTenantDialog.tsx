
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AddTenantDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  newTenant: {
    name: string;
    description: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  };
  setNewTenant: (tenant: {
    name: string;
    description: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  }) => void;
  handleAddTenant: () => Promise<void>;
}

const AddTenantDialog = ({
  isOpen,
  setIsOpen,
  newTenant,
  setNewTenant,
  handleAddTenant,
}: AddTenantDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddTenant}>Create Tenant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantDialog;
