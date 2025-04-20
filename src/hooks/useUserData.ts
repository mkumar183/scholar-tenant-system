
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
          name: school.name
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

        const teacherIds = (teachersData || []).map(teacher => teacher.id);
        const { data: emailData, error: emailError } = await supabase
          .rpc('get_user_emails', { user_ids: teacherIds });

        if (emailError) {
          console.error('Error fetching emails:', emailError);
        }

        const emailMap = new Map<string, string>();
        if (emailData) {
          emailData.forEach(userData => {
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
        
        const studentIds = (studentsData || []).map(student => student.id);
        const { data: studentEmailData, error: studentEmailError } = await supabase
          .rpc('get_user_emails', { user_ids: studentIds });

        if (studentEmailError) {
          console.error('Error fetching student emails:', studentEmailError);
        }

        const studentEmailMap = new Map<string, string>();
        if (studentEmailData) {
          studentEmailData.forEach(userData => {
            if (userData.id && userData.email) {
              studentEmailMap.set(userData.id, userData.email);
            }
          });
        }
        
        // Fetch student admissions
        const { data: admissionsData, error: admissionsError } = await supabase
          .from('student_admissions')
          .select(`
            id,
            student_id,
            school_id,
            grade_id,
            status,
            admitted_by,
            grade:grades(id, name)
          `);
        
        if (admissionsError) {
          console.error('Error fetching student admissions:', admissionsError);
        }
        
        // Create a map of student admissions
        const admissionsMap = new Map();
        if (admissionsData) {
          admissionsData.forEach(admission => {
            admissionsMap.set(admission.student_id, {
              status: admission.status,
              gradeId: admission.grade_id,
              gradeName: admission.grade?.name || 'Unknown Grade',
              admittedBy: admission.admitted_by
            });
          });
        }
        
        const formattedTeachers: Teacher[] = (teachersData || []).map(teacher => ({
          id: teacher.id,
          name: teacher.name || 'No Name',
          email: emailMap.get(teacher.id) || 'Not provided',
          phone: 'Not provided',
          role: teacher.role as 'teacher' | 'staff' | 'school_admin',
          schoolId: teacher.school_id || '',
          schoolName: teacher.school?.name || 'No School',
          subjects: [],
        }));
        
        const formattedStudents: Student[] = (studentsData || []).map(student => {
          const admission = admissionsMap.get(student.id);
          return {
            id: student.id,
            name: student.name || 'No Name',
            email: studentEmailMap.get(student.id) || 'Not provided',
            phone: 'Not provided',
            role: 'student',
            schoolId: student.school_id || '',
            schoolName: student.school?.name || 'No School',
            grade: admission ? admission.gradeName : 'Not specified',
            gradeId: admission ? admission.gradeId : undefined,
            guardianName: 'Not specified',
            dateOfBirth: student.date_of_birth || '',
            admissionStatus: admission ? admission.status : undefined,
            admittedBy: admission ? admission.admittedBy : undefined,
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
