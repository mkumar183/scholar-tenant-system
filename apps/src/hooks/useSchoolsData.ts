
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface School {
  id: string;
  name: string;
  address: string | null;
  type: string | null;
  tenantId: string;
  tenantName?: string;
  teacherCount: number;
  studentCount: number;
}

export const useSchoolsData = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchSchools = useCallback(async () => {
    if (!user?.tenantId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch schools for this tenant
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('*')
        .eq('tenant_id', user.tenantId);

      if (schoolsError) throw schoolsError;

      // Get student and teacher counts for each school
      const schoolsWithCounts = await Promise.all(
        (schoolsData || []).map(async (school) => {
          // Get teacher count
          const { count: teacherCount, error: teacherError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', school.id)
            .eq('role', 'teacher');

          if (teacherError) {
            console.error('Error fetching teacher count:', teacherError);
          }

          // Get student count
          const { count: studentCount, error: studentError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', school.id)
            .eq('role', 'student');

          if (studentError) {
            console.error('Error fetching student count:', studentError);
          }

          // Format school data
          return {
            id: school.id,
            name: school.name,
            address: school.address || '',
            type: school.type,
            tenantId: school.tenant_id,
            teacherCount: teacherCount || 0,
            studentCount: studentCount || 0,
          };
        })
      );

      setSchools(schoolsWithCounts);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Failed to fetch schools data');
    } finally {
      setIsLoading(false);
    }
  }, [user?.tenantId]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const refreshSchools = () => {
    fetchSchools();
  };

  return { schools, isLoading, refreshSchools };
};
