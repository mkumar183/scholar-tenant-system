import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Teacher, Student, School } from '@/types';
import { useStudentAdmissions } from './useStudentAdmissions';

export const useUserManagement = () => {
  const { user } = useAuth();
  const { createStudentAdmission } = useStudentAdmissions();
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
    gradeId: '',
    schoolId: '',
    remarks: '',
  });
  const [currentAcademicSession, setCurrentAcademicSession] = useState<string | null>(null);

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
          phone: newTeacher.phone || '',
          role: newTeacher.role,
          schoolId: newTeacher.schoolId,
          schoolName: schoolName,
          subjects: [],
          tenantId: user?.tenantId || ''
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
      if (!newStudent.name || !newStudent.email || !newStudent.schoolId || !newStudent.gradeId) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Store the current auth session to restore it after student creation
      const { data: currentSession } = await supabase.auth.getSession();
      console.log('Current session before signup:', currentSession);
      
      const school = schools.find(s => s.id === newStudent.schoolId);
      const schoolName = school ? school.name : '';
      
      // Get current academic session
      const { data: academicSession, error: sessionError } = await supabase
        .from('academic_sessions')
        .select('id')
        .eq('tenant_id', user?.tenantId)
        .eq('is_active', true)
        .single();

      if (sessionError || !academicSession) {
        throw new Error('No active academic session found');
      }
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStudent.email,
        password: 'Password123', // default password
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
      console.log('New user created with ID:', userId);
      
      // Get session after signup
      const { data: sessionAfterSignup } = await supabase.auth.getSession();
      console.log('Session after signup:', sessionAfterSignup);
      
      // Restore the original session and wait for it to complete
      if (currentSession?.session) {
        const { error: restoreError } = await supabase.auth.setSession(currentSession.session);
        if (restoreError) {
          console.error('Error restoring session:', restoreError);
          throw restoreError;
        }
        
        // Verify session restoration
        const { data: restoredSession } = await supabase.auth.getSession();
        console.log('Session after restoration:', restoredSession);
        
        if (!restoredSession?.session) {
          throw new Error('Failed to restore session');
        }
      }
      
      // Create user record with explicit select
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          name: newStudent.name,
          role: 'student',
          tenant_id: user?.tenantId,
          school_id: newStudent.schoolId,
          date_of_birth: newStudent.dateOfBirth || null,
        })
        .select('*')
        .single();
      
      if (userError) {
        console.error('Error creating user record:', userError);
        throw userError;
      }
      
      console.log('User record created:', userData);
      
      if (userData) {
        // Create student admission record with academic session
        const admission = await createStudentAdmission(
          userId,
          newStudent.schoolId,
          newStudent.gradeId,
          newStudent.remarks,
          academicSession.id
        );
        
        if (!admission) {
          throw new Error('Failed to create student admission record');
        }
        
        const newStudentData: Student = {
          id: userData.id,
          name: userData.name,
          email: newStudent.email,
          phone: newStudent.phone || '',
          role: 'student',
          schoolId: userData.school_id,
          schoolName: schoolName,
          dateOfBirth: userData.date_of_birth,
          gradeId: newStudent.gradeId,
          grade: 'Unknown',
          admissionStatus: 'active',
          admittedBy: user?.id
        };
        
        setStudents([...students, newStudentData]);
        setNewStudent({
          name: '',
          email: '',
          phone: '',
          guardianName: '',
          dateOfBirth: '',
          gradeId: '',
          schoolId: '',
          remarks: '',
        });
        setIsAddDialogOpen(false);
        toast.success('Student admitted successfully');
      }
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast.error(`Failed to add student: ${error.message || 'Unknown error'}`);
    }
  };

  const createStudent = async (studentData: Omit<Student, 'id'>) => {
    return await handleAddStudent();
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
