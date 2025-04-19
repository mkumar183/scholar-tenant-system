
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
          .select('id, name');
        
        if (schoolsError) throw schoolsError;
        
        const formattedSchools: School[] = schoolsData.map(school => ({
          id: school.id,
          name: school.name || 'Unnamed School'
        }));
        
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
          .eq('role', 'student');
        
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

        // Fetch current section enrollments for students
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('current_section_enrollments')
          .select('*')
          .in('student_id', studentIds);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
        }

        // Create a map of student enrollments
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
          const enrollment = enrollmentsMap.get(student.id);
          return {
            id: student.id,
            name: student.name || 'No Name',
            email: studentEmailMap.get(student.id) || 'Not provided',
            phone: 'Not provided',
            role: 'student',
            schoolId: student.school_id || '',
            schoolName: student.school?.name || 'No School',
            grade: enrollment ? enrollment.gradeName : 'Not specified',
            guardianName: 'Not specified',
            dateOfBirth: student.date_of_birth || '',
            admissionStatus: enrollment ? enrollment.status : undefined,
          };
        });
        
        setTeachers(formattedTeachers);
        setStudents(formattedStudents);

      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [user?.tenantId, setTeachers, setStudents, setSchools, setIsLoading]);
};
