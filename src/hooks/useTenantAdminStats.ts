
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface TenantAdminStats {
  schoolsCount: number;
  teachersCount: number;
  studentsCount: number;
  classesCount: number;
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
    classesCount: 0,
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

        // Fetch classes count
        let classesCount = 0;
        if (schools && schools.length > 0) {
          const schoolIds = schools.map(school => school.id);
          const { count: classes, error: classesError } = await supabase
            .from('classes')
            .select('*', { count: 'exact', head: true })
            .in('school_id', schoolIds);

          if (classesError) throw classesError;
          classesCount = classes || 0;
        }

        // Get student count per school
        const schoolsWithStudentCount = await Promise.all(
          (schools || []).map(async (school) => {
            const { count, error } = await supabase
              .from('users')
              .select('*', { count: 'exact', head: true })
              .eq('school_id', school.id)
              .eq('role', 'student');
              
            if (error) {
              console.error('Error fetching student count for school:', error);
              return {
                ...school,
                studentCount: 0
              };
            }
            
            return {
              id: school.id,
              name: school.name,
              type: school.type,
              studentCount: count || 0
            };
          })
        );

        setStats({
          schoolsCount: schools?.length || 0,
          teachersCount: teachersCount || 0,
          studentsCount: studentsCount || 0,
          classesCount: classesCount,
          schools: schoolsWithStudentCount
        });
      } catch (error) {
        console.error('Error fetching tenant stats:', error);
        toast.error('Failed to fetch dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenantStats();
  }, [user?.tenantId]);

  return { stats, isLoading };
};
