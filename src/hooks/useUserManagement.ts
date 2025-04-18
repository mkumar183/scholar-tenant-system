import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Teacher, Student, School } from '@/types';

export const useUserManagement = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    schoolId: '',
    subjects: [],
    password: '',
    role: '',
  });
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    guardianName: '',
    dateOfBirth: '',
  });

  const handleAddTeacher = async () => {
    try {
      if (!newTeacher.name || !newTeacher.email || !newTeacher.schoolId || !newTeacher.role) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      const school = schools.find(s => s.id === newTeacher.schoolId);
      const schoolName = school ? school.name : 'Unknown School';
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newTeacher.email,
        password: newTeacher.password,
        options: {
          data: {
            name: newTeacher.name,
            role: newTeacher.role
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
          role: newTeacher.role,
          school_id: newTeacher.schoolId,
          tenant_id: user?.tenantId
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newTeacherData: Teacher = {
          id: data[0].id,
          name: newTeacher.name,
          email: newTeacher.email,
          phone: newTeacher.phone || 'Not provided',
          role: newTeacher.role as 'teacher' | 'staff' | 'school_admin',
          schoolId: newTeacher.schoolId,
          schoolName: schoolName,
          subjects: [],
        };
        
        setTeachers([...teachers, newTeacherData]);
        setNewTeacher({
          name: '',
          email: '',
          phone: '',
          schoolId: '',
          subjects: [],
          password: '',
          role: '',
        });
        setIsAddDialogOpen(false);
        toast.success('Teacher added successfully');
      }
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      toast.error(`Failed to add teacher: ${error.message || 'Unknown error'}`);
    }
  };

  const handleAddStudent = async () => {
    try {
      if (!newStudent.name || !newStudent.email) {
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
        .insert({
          id: userId,
          name: newStudent.name,
          role: 'student',
          tenant_id: user?.tenantId,
          date_of_birth: newStudent.dateOfBirth || null,
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newStudentData: Student = {
          id: data[0].id,
          name: newStudent.name,
          email: newStudent.email,
          phone: newStudent.phone,
          role: 'student',
          schoolId: '',
          schoolName: '',
          guardianName: newStudent.guardianName,
          dateOfBirth: newStudent.dateOfBirth,
        };
        
        setStudents([...students, newStudentData]);
        setNewStudent({
          name: '',
          email: '',
          phone: '',
          guardianName: '',
          dateOfBirth: '',
        });
        setIsAddDialogOpen(false);
        toast.success('Student added successfully');
      }
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast.error(`Failed to add student: ${error.message || 'Unknown error'}`);
    }
  };

  return {
    teachers,
    setTeachers,
    students,
    setStudents,
    schools,
    setSchools,
    isLoading,
    setIsLoading,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newTeacher,
    setNewTeacher,
    newStudent,
    setNewStudent,
    handleAddTeacher,
    handleAddStudent,
  };
};
