
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  schoolId: string;
  schoolName: string;
  subjects: string[];
}

interface NewTeacher {
  name: string;
  email: string;
  phone: string;
  schoolId: string;
  subjects: string[];
}

export const useTeachers = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data: teachersData, error: teachersError } = await supabase
        .from('users')
        .select(`
          id, 
          name, 
          role,
          school_id,
          tenant_id,
          schools:schools(name)
        `)
        .eq('role', 'teacher');
      
      if (teachersError) throw teachersError;
      
      const formattedTeachers = teachersData.map(teacher => ({
        id: teacher.id,
        name: teacher.name || 'No Name',
        email: 'Not provided',
        phone: 'Not provided',
        role: teacher.role,
        schoolId: teacher.school_id || '',
        schoolName: teacher.schools?.name || 'No School',
        subjects: ['Not specified'],
      }));
      
      setTeachers(formattedTeachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setIsLoading(false);
    }
  };

  const addTeacher = async (newTeacher: NewTeacher) => {
    try {
      if (!newTeacher.name || !newTeacher.email || !newTeacher.schoolId) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newTeacher.email,
        password: 'Password123',
        options: {
          data: {
            name: newTeacher.name,
            role: 'teacher'
          }
        }
      });
      
      if (authError) throw new Error(`Failed to create auth user: ${authError.message}`);
      if (!authData.user) throw new Error('Failed to create auth user, no user returned');
      
      const userId = authData.user.id;
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: userId,
          name: newTeacher.name,
          role: 'teacher',
          school_id: newTeacher.schoolId,
          tenant_id: user?.tenantId
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newTeacherData = {
          id: data[0].id,
          name: newTeacher.name,
          email: newTeacher.email,
          phone: newTeacher.phone || 'Not provided',
          role: 'teacher',
          schoolId: newTeacher.schoolId,
          schoolName: schools.find(s => s.id === newTeacher.schoolId)?.name || 'No School',
          subjects: newTeacher.subjects[0] ? [newTeacher.subjects[0]] : ['Not specified'],
        };
        
        setTeachers(prev => [...prev, newTeacherData]);
        toast.success('Teacher added successfully');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      toast.error(`Failed to add teacher: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  return {
    teachers,
    isLoading,
    addTeacher
  };
};
