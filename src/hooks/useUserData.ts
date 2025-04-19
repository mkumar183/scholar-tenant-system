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
          .select('id, name')
          .returns<Array<{ id: string; name: string }>>();
        
        if (schoolsError) throw schoolsError;
        
        const formattedSchools: School[] = (schoolsData || []).map(school => ({
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
          .eq('tenant_id', user?.tenantId)
          .returns<Array<{
            id: string;
            name: string | null;
            role: string;
            school_id: string | null;
            tenant_id: string | null;
            school: { name: string } | null;
          }>>();
        
        if (teachersError) throw teachersError;

        const teacherIds = (teachersData || []).map(teacher => teacher.id);
        const { data: emailData, error: emailError } = await supabase
          .rpc('get_user_emails', { user_ids: teacherIds })
          .returns<Array<{ id: string; email: string }>>();

        if (emailError) {
          console.error('Error fetching emails:', emailError);
        }

        const emailMap = new Map<string, string>();
        if (emailData) {
          (emailData as Array<{ id: string; email: string }>).forEach(email => {
            emailMap.set(email.id, email.email);
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
        
        setTeachers(formattedTeachers);

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
          .eq('tenant_id', user?.tenantId)
          .returns<Array<{
            id: string;
            name: string | null;
            role: string;
            school_id: string | null;
            tenant_id: string | null;
            date_of_birth: string | null;
            school: { name: string } | null;
          }>>();
        
        if (studentsError) throw studentsError;

        const studentIds = (studentsData || []).map(student => student.id);
        const { data: studentEmailData, error: studentEmailError } = await supabase
          .rpc('get_user_emails', { user_ids: studentIds })
          .returns<Array<{ id: string; email: string }>>();

        if (studentEmailError) {
          console.error('Error fetching student emails:', studentEmailError);
        }

        const studentEmailMap = new Map<string, string>();
        if (studentEmailData) {
          (studentEmailData as Array<{ id: string; email: string }>).forEach(email => {
            studentEmailMap.set(email.id, email.email);
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
          `)
          .returns<Array<{
            id: string;
            student_id: string;
            school_id: string;
            grade_id: string;
            status: string;
            admitted_by: string;
            grade: { id: string; name: string } | null;
          }>>();
        
        if (admissionsError) {
          console.error('Error fetching student admissions:', admissionsError);
        }
        
        // Create a map of student admissions
        const admissionsMap = new Map<string, {
          status: string;
          gradeId: string;
          gradeName: string;
          admittedBy: string;
        }>();
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
            tenant_id: student.tenant_id || undefined,
            school_id: student.school_id || undefined,
            admissionStatus: admission ? admission.status : undefined,
            admittedBy: admission ? admission.admittedBy : undefined
          };
        });
        
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
