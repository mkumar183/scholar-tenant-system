
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Student } from '@/types';

export const useStudents = (gradeId?: string) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      let query = supabase
        .from('users')
        .select('*, student_admissions!inner(*)')
        .eq('role', 'student')
        .eq('student_admissions.status', 'active');

      if (gradeId) {
        query = query.eq('student_admissions.grade_id', gradeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [gradeId]);

  return { students, isLoading };
};
