import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, School, Users, BookOpen, MapPin, Mail, Calendar, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import EditSchoolForm from '@/components/schools/EditSchoolForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SchoolDetails {
  id: string;
  name: string;
  address: string | null;
  type: string | null;
  tenant_id: string;
  created_at: string;
  teacherCount: number;
  studentCount: number;
}

const SchoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [school, setSchool] = useState<SchoolDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchSchoolDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch school data
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('*')
        .eq('id', id)
        .single();

      if (schoolError) throw schoolError;

      // Get teacher count
      const { count: teacherCount, error: teacherError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', id)
        .eq('role', 'teacher');

      if (teacherError) throw teacherError;

      // Get student count
      const { count: studentCount, error: studentError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', id)
        .eq('role', 'student');

      if (studentError) throw studentError;

      setSchool({
        ...schoolData,
        teacherCount: teacherCount || 0,
        studentCount: studentCount || 0,
      });
    } catch (error) {
      console.error('Error fetching school details:', error);
      toast.error('Failed to load school details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Debug - Current user:', user);
    console.log('Debug - User role:', user?.role);
    console.log('Debug - Is tenant_admin:', user?.role === 'tenant_admin');
    fetchSchoolDetails();
  }, [id, user]);

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    fetchSchoolDetails();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">School Not Found</h1>
          <p className="text-muted-foreground">The requested school could not be found.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/schools')}
          >
            Back to Schools
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/schools')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{school.name}</h1>
        </div>
        {(() => {
          console.log('Debug - Rendering edit button check:', user?.role === 'tenant_admin');
          return user?.role === 'tenant_admin' && (
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit School
            </Button>
          );
        })()}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{school.name}</CardTitle>
              <CardDescription>{school.type || 'No type specified'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Teachers</p>
                    <p className="text-sm text-muted-foreground">{school.teacherCount} Teachers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Students</p>
                    <p className="text-sm text-muted-foreground">{school.studentCount} Students</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{school.address || 'No address provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {school.created_at ? format(new Date(school.created_at), 'MMM d, yyyy') : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
          </DialogHeader>
          {school && (
            <EditSchoolForm
              school={school}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolDetails; 