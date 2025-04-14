
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  schoolId: string;
  schoolName: string;
  grade: string;
  guardianName: string;
}

interface NewStudent {
  name: string;
  email: string;
  phone: string;
  schoolId: string;
  grade: string;
  guardianName: string;
}

export const useStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('users')
        .select(`
          id, 
          name, 
          role,
          school_id,
          tenant_id,
          schools:schools(name)
        `)
        .eq('role', 'student');
      
      if (studentsError) throw studentsError;
      
      const formattedStudents = studentsData.map(student => ({
        id: student.id,
        name: student.name || 'No Name',
        email: 'Not provided',
        phone: 'Not provided',
        role: student.role,
        schoolId: student.school_id || '',
        schoolName: student.schools?.name || 'No School',
        grade: 'Not specified',
        guardianName: 'Not specified',
      }));
      
      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const addStudent = async (newStudent: NewStudent) => {
    try {
      if (!newStudent.name || !newStudent.email || !newStudent.schoolId) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStudent.email,
        password: 'Password123',
        options: {
          data: {
            name: newStudent.name,
            role: 'student'
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
          name: newStudent.name,
          role: 'student',
          school_id: newStudent.schoolId,
          tenant_id: user?.tenantId
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newStudentData = {
          id: data[0].id,
          name: newStudent.name,
          email: newStudent.email,
          phone: newStudent.phone || 'Not provided',
          role: 'student',
          schoolId: newStudent.schoolId,
          schoolName: schools.find(s => s.id === newStudent.schoolId)?.name || 'No School',
          grade: newStudent.grade,
          guardianName: newStudent.guardianName,
        };
        
        setStudents(prev => [...prev, newStudentData]);
        toast.success('Student added successfully');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast.error(`Failed to add student: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  return {
    students,
    isLoading,
    addStudent
  };
};
