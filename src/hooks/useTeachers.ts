
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
  password: string; // Added password field
}

export const useTeachers = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchTeachers();
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name');
      
      if (error) throw error;
      if (data) {
        setSchools(data);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      console.log('Fetching teachers...');
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
      
      console.log('Teachers data from database:', teachersData);
      
      // Get emails from auth.users table using user IDs
      // Note: We can't directly query auth.users, so we use user metadata
      const teacherIds = teachersData.map(teacher => teacher.id);
      
      // Fetch user emails from the auth system
      // This is simulated since we can't directly query auth.users
      // In a real app, this data should be stored in a public profiles table
      
      const formattedTeachers = teachersData.map(teacher => {
        // Find the school name
        const school = teacher.schools ? teacher.schools.name : 'No School';
        
        return {
          id: teacher.id,
          name: teacher.name || 'No Name',
          email: `${teacher.name?.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Simulated email
          phone: 'Not provided',
          role: teacher.role,
          schoolId: teacher.school_id || '',
          schoolName: school || 'No School',
          subjects: ['Not specified'],
        };
      });
      
      console.log('Formatted teachers:', formattedTeachers);
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
      if (!newTeacher.name || !newTeacher.email || !newTeacher.schoolId || !newTeacher.password) {
        toast.error('Please fill in all required fields');
        return false;
      }
      
      console.log('Adding teacher with data:', newTeacher);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newTeacher.email,
        password: newTeacher.password, // Use the provided password instead of hardcoded one
        options: {
          data: {
            name: newTeacher.name,
            role: 'teacher'
          }
        }
      });
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error(`Failed to create auth user: ${authError.message}`);
      }
      
      if (!authData.user) {
        throw new Error('Failed to create auth user, no user returned');
      }
      
      console.log('Auth user created:', authData.user);
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
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Teacher added to database:', data);
      
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
