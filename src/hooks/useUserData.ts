import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { School, Teacher, Student } from '@/types';

export const useUserData = (
  setTeachers: (teachers: Teacher[]) => void,
  setStudents: (students: Student[]) => void,
  setSchools: (schools: School[]) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      
      try {
        // Fetch schools
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('schools')
          .select('id, name, tenant_id, address, type, created_at, updated_at');
        
        if (schoolsError) throw schoolsError;
        
        const formattedSchools: School[] = schoolsData;
        setSchools(formattedSchools);
        
        // Fetch teachers
        const { data: teachersData, error: teachersError } = await supabase
          .from('users')
          .select(`
            id, 
            name, 
            role,
            school_id,
            tenant_id,
            school:schools!users_school_id_fkey(name)
          `)
          .in('role', ['teacher', 'staff', 'school_admin'])
          .eq('tenant_id', user?.tenantId);
        
        if (teachersError) throw teachersError;

        const teacherIds = teachersData.map(teacher => teacher.id);
        const { data: emailData, error: emailError } = await supabase
          .rpc('get_user_emails', { user_ids: teacherIds });

        if (emailError) {
          console.error('Error fetching emails:', emailError);
        }

        const emailMap = new Map();
        if (emailData) {
          emailData.forEach((userData: { id: string, email: string }) => {
            if (userData.id && userData.email) {
              emailMap.set(userData.id, userData.email);
            }
          });
        }
        
        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('users')
          .select(`
            id, 
            name, 
            role,
            school_id,
            tenant_id,
            date_of_birth,
            school:schools!users_school_id_fkey(name)
          `)
          .eq('role', 'student')
          .eq('tenant_id', user?.tenantId);
        
        if (studentsError) throw studentsError;
        
        const studentIds = studentsData.map(student => student.id);
        const { data: studentEmailData, error: studentEmailError } = await supabase
          .rpc('get_user_emails', { user_ids: studentIds });

        if (studentEmailError) {
          console.error('Error fetching student emails:', studentEmailError);
        }

        const studentEmailMap = new Map();
        if (studentEmailData) {
          studentEmailData.forEach((userData: { id: string, email: string }) => {
            if (userData.id && userData.email) {
              studentEmailMap.set(userData.id, userData.email);
            }
          });
        }

        // Fetch student admissions for students
        const { data: admissionsData, error: admissionsError } = await supabase
          .from('student_admissions')
          .select(`
            id,
            student_id,
            school_id,
            grade_id,
            status,
            admitted_by,
            grade:grade_id(id, name)
          `)
          .in('student_id', studentIds);

        if (admissionsError) {
          console.error('Error fetching admissions:', admissionsError);
        }

        // Create a map of student admissions
        const admissionsMap = new Map();
        if (admissionsData) {
          admissionsData.forEach(admission => {
            admissionsMap.set(admission.student_id, {
              gradeName: admission.grade?.name,
              gradeId: admission.grade_id,
              status: admission.status,
              admittedBy: admission.admitted_by
            });
          });
        }

        // Fetch current section enrollments for students
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('current_section_enrollments')
          .select('*')
          .in('student_id', studentIds);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
        }

        // Create a map of student enrollments (will use alongside admissions)
        const enrollmentsMap = new Map();
        if (enrollmentsData) {
          enrollmentsData.forEach(enrollment => {
            enrollmentsMap.set(enrollment.student_id, {
              sectionName: enrollment.section_name,
              gradeName: enrollment.grade_name,
              status: enrollment.status
            });
          });
        }
        
        const formattedTeachers: Teacher[] = teachersData.map(teacher => ({
          id: teacher.id,
          name: teacher.name || 'No Name',
          email: emailMap.get(teacher.id) || 'Not provided',
          phone: 'Not provided',
          role: teacher.role as 'teacher' | 'staff' | 'school_admin',
          schoolId: teacher.school_id || '',
          schoolName: teacher.school?.name || 'No School',
          subjects: [],
        }));
        
        const formattedStudents: Student[] = studentsData.map(student => {
          const admission = admissionsMap.get(student.id);
          const enrollment = enrollmentsMap.get(student.id);
          
          return {
            id: student.id,
            name: student.name || 'No Name',
            email: studentEmailMap.get(student.id) || 'Not provided',
            phone: 'Not provided',
            role: 'student',
            schoolId: student.school_id || '',
            schoolName: student.school?.name || 'No School',
            grade: admission?.gradeName || enrollment?.gradeName || 'Not specified',
            gradeId: admission?.gradeId || '',
            guardianName: 'Not specified',
            dateOfBirth: student.date_of_birth || '',
            admissionStatus: admission?.status || undefined,
            admittedBy: admission?.admittedBy || undefined,
          };
        });
        
        setTeachers(formattedTeachers);
        setStudents(formattedStudents);
        setSchools(formattedSchools);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [user?.tenantId, setTeachers, setStudents, setSchools, setIsLoading]);
  
  return {
    teachers,
    students,
    schools,
    isLoading,
    setTeachers,
    setStudents,
    setSchools,
    setIsLoading
  };
};
