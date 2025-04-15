import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Student } from '@/types';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addStudent = async (student: Student) => {
    try {
      const { error } = await supabase.from('users').insert([student]);
      if (error) throw error;
      await fetchStudents();
      return true;
    } catch (error) {
      console.error('Error adding student:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, isLoading, addStudent };
}; 