import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, School, Users, Building, Mail, Calendar } from 'lucide-react';
import { TenantType } from '@/types/tenant.types';
import { format } from 'date-fns';

const TenantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tenant, setTenant] = useState<TenantType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState<any[]>([]);

  const fetchTenantDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch tenant data
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single();

      if (tenantError) throw tenantError;

      // Fetch schools count
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('*')
        .eq('tenant_id', id);

      if (schoolsError) throw schoolsError;

      // Format tenant data
      const formattedTenant: TenantType = {
        id: tenantData.id,
        name: tenantData.name,
        description: tenantData.description,
        schoolCount: schoolsData.length,
        adminName: tenantData.admin_name,
        adminEmail: tenantData.admin_email,
      };

      setTenant(formattedTenant);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Error fetching tenant details:', error);
      toast.error('Failed to load tenant details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTenantDetails();
    }
  }, [id]);

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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/tenants')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Tenant Details</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : tenant ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{tenant.name}</CardTitle>
                <CardDescription>{tenant.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <School className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Schools</p>
                      <p className="text-sm text-muted-foreground">{tenant.schoolCount} Schools</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Admin</p>
                      <p className="text-sm text-muted-foreground">{tenant.adminName || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Admin Email</p>
                      <p className="text-sm text-muted-foreground">{tenant.adminEmail || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {tenant.created_at ? format(new Date(tenant.created_at), 'MMM d, yyyy') : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-3">Actions</h3>
                  <div className="flex gap-2">
                    <Button>Edit Tenant</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Schools</CardTitle>
                <CardDescription>Schools managed by this tenant</CardDescription>
              </CardHeader>
              <CardContent>
                {schools.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">No schools added yet</p>
                ) : (
                  <ul className="space-y-3">
                    {schools.map((school) => (
                      <li key={school.id} className="flex items-center gap-3 p-3 rounded-md border">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{school.name}</p>
                          <p className="text-xs text-muted-foreground">{school.type || 'No type specified'}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">Tenant not found</h3>
          <p className="text-muted-foreground">The tenant you're looking for doesn't exist or you don't have access.</p>
          <Button className="mt-4" onClick={() => navigate('/tenants')}>
            Back to Tenants
          </Button>
        </div>
      )}
    </div>
  );
};

export default TenantDetails;
