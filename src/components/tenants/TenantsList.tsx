
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { School, Users } from 'lucide-react';
import { TenantType } from '@/types/tenant.types';

interface TenantsListProps {
  isLoading: boolean;
  tenants: TenantType[];
  searchTerm: string;
}

const TenantsList = ({ isLoading, tenants, searchTerm }: TenantsListProps) => {
  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.adminName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredTenants.length === 0) {
    return (
      <div className="text-center py-12">
        <School className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No tenants found</h3>
        <p className="text-muted-foreground">Try adjusting your search or add a new tenant.</p>
      </div>
    );
  }

  return (
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
  );
};

export default TenantsList;
