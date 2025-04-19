
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
        
        // Fetch teachers with proper type annotations
        const { data: teachersData, error: teachersError } = await supabase
          .from('users')
          .select(`
            id, 
            name, 
            role,
            school_id,
            tenant_id,
            school:schools!users_school_id_fkey(id, name)
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
          emailData.forEach(email => {
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

        // Fetch students with proper type annotations
        const { data: studentsData, error: studentsError } = await supabase
          .from('users')
          .select(`
            id, 
            name, 
            role,
            school_id,
            tenant_id,
            date_of_birth,
            school:schools!users_school_id_fkey(id, name)
          `)
          .eq('role', 'student')
          .eq('tenant_id', user?.tenantId);
        
        if (studentsError) throw studentsError;

        const studentIds = (studentsData || []).map(student => student.id);
        const { data: studentEmailData, error: studentEmailError } = await supabase
          .rpc('get_user_emails', { user_ids: studentIds });

        if (studentEmailError) {
          console.error('Error fetching student emails:', studentEmailError);
        }

        const studentEmailMap = new Map<string, string>();
        if (studentEmailData) {
          studentEmailData.forEach(email => {
            studentEmailMap.set(email.id, email.email);
          });
        }
        
        const formattedStudents: Student[] = (studentsData || []).map(student => {
          return {
            id: student.id,
            name: student.name || 'No Name',
            email: studentEmailMap.get(student.id) || 'Not provided',
            phone: 'Not provided',
            role: 'student',
            schoolId: student.school_id || '',
            schoolName: student.school?.name || 'No School',
            grade: 'Not specified',
            guardianName: 'Not specified',
            dateOfBirth: student.date_of_birth || '',
            tenant_id: student.tenant_id || undefined,
            school_id: student.school_id || undefined,
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
