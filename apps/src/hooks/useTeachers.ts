import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Teacher } from '@/types';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .in('role', ['teacher', 'staff', 'school_admin']);

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTeacher = async (teacher: Teacher) => {
    try {
      const { error } = await supabase.from('users').insert([teacher]);
      if (error) throw error;
      await fetchTeachers();
      return true;
    } catch (error) {
      console.error('Error adding teacher:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return { teachers, isLoading, addTeacher };
}; 