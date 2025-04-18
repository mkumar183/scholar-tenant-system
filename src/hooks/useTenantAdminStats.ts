
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface TenantAdminStats {
  schoolsCount: number;
  teachersCount: number;
  studentsCount: number;
  classesCount: number; // Added the missing property
  schools: {
    id: string;
    name: string;
    type: string | null;
    studentCount: number;
  }[];
}

export const useTenantAdminStats = () => {
  const [stats, setStats] = useState<TenantAdminStats>({
    schoolsCount: 0,
    teachersCount: 0,
    studentsCount: 0,
    classesCount: 0, // Initialize with 0
    schools: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTenantStats = async () => {
      if (!user?.tenantId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch schools for this tenant
        const { data: schools, error: schoolsError } = await supabase
          .from('schools')
          .select('*')
          .eq('tenant_id', user.tenantId);

        if (schoolsError) throw schoolsError;

        // Fetch teachers count
        const { count: teachersCount, error: teachersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', user.tenantId)
          .eq('role', 'teacher');

        if (teachersError) throw teachersError;

        // Fetch students count
        const { count: studentsCount, error: studentsError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', user.tenantId)
          .eq('role', 'student');

        if (studentsError) throw studentsError;
        
        // Fetch sections count (classes)
        const { count: classesCount, error: classesError } = await supabase
          .from('sections')
          .select('*', { count: 'exact', head: true })
          .in('school_id', schools?.map(school => school.id) || []);
          
        if (classesError) throw classesError;

        // Calculate student count per school
        const schoolsWithStats = await Promise.all(
          (schools || []).map(async (school) => {
            const { count: studentCount } = await supabase
              .from('users')
              .select('*', { count: 'exact', head: true })
              .eq('school_id', school.id)
              .eq('role', 'student');

            return {
              id: school.id,
              name: school.name,
              type: school.type,
              studentCount: studentCount || 0
            };
          })
        );

        setStats({
          schoolsCount: schools?.length || 0,
          teachersCount: teachersCount || 0,
          studentsCount: studentsCount || 0,
          classesCount: classesCount || 0, // Add the classes count
          schools: schoolsWithStats
        });
      } catch (error) {
        console.error('Error fetching tenant stats:', error);
        toast.error('Failed to fetch tenant statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenantStats();
  }, [user?.tenantId]);

  return { stats, isLoading };
};
