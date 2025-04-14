import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, BookOpen, MapPin, Calendar, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EditSchoolForm } from '@/components/schools/EditSchoolForm';

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    fetchSchoolDetails();
  }, [id]);

  const handleUpdateSuccess = () => {
    setIsSheetOpen(false);
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
          <p className="text-muted-foreground mb-6">The requested school could not be found.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/schools')}
          >
            Back to Schools
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user?.role === 'tenant_admin' || user?.role === 'school_admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/schools')}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{school.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>{school.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {school.address || 'No address specified'}
              </CardDescription>
            </div>
            {canEdit && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit School</SheetTitle>
                    <SheetDescription>
                      Make changes to school information here. Click save when you're done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    <EditSchoolForm
                      school={school}
                      onSuccess={handleUpdateSuccess}
                      onCancel={() => setIsSheetOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">School Type</label>
                <p className="font-medium">{school.type || 'Not specified'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Creation Date</label>
                <p className="font-medium">
                  {school.created_at ? format(new Date(school.created_at), 'MMM d, yyyy') : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="border-muted bg-muted/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{school.teacherCount}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Teachers</p>
                </CardContent>
              </Card>

              <Card className="border-muted bg-muted/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{school.studentCount}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Students</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolDetails;
