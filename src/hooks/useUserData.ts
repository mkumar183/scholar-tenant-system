import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { School, Teacher, Student } from '@/types';

interface StudentAdmission {
  id: string;
  student_id: string;
  school_id: string;
  grade_id: string;
  status: string;
  admitted_by: string;
  created_at: string;
  updated_at: string;
  student: {
    id: string;
    name: string;
    email: string | null;
    role: string;
    school_id: string;
    school_name: string | null;
    guardian_name: string | null;
    date_of_birth: string | null;
    tenant_id: string;
    created_at: string;
    updated_at: string;
  };
  grade: {
    id: string;
    name: string;
    level: number;
    tenant_id: string;
    created_at: string;
    updated_at: string;
  };
}

interface StudentEmail {
  id: string;
  email: string;
}

interface TeacherData {
  id: string;
  name: string;
  role: string;
  school_id: string;
  tenant_id: string;
  school: {
    name: string;
  };
}

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
        
        // Fetch student admissions with related data
        const { data: admissionsData, error: admissionsError } = await supabase
          .from('student_admissions')
          .select(`
            id,
            student_id,
            school_id,
            grade_id,
            status,
            admitted_by,
            created_at,
            updated_at,
            student:users!student_id(
              id,
              name,
              role,
              school_id,
              date_of_birth,
              tenant_id,
              created_at,
              updated_at,
              school:schools!users_school_id_fkey(name)
            ),
            grade:grades!grade_id(
              id,
              name,
              level,
              tenant_id,
              created_at,
              updated_at
            )
          `);
        
        if (admissionsError) throw admissionsError;

        // Get student IDs to fetch emails
        const studentIds = (admissionsData || []).map(admission => admission.student_id);
        const { data: studentEmailData, error: studentEmailError } = await supabase
          .rpc('get_user_emails', { user_ids: studentIds }) as { data: StudentEmail[] | null, error: any };

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

        // Get active enrollments for these students
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('student_section_enrollments')
          .select(`
            student_id,
            section:sections(
              id,
              name
            )
          `)
          .eq('status', 'active');

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
        }

        const enrollmentMap = new Map<string, { id: string; name: string }>();
        if (enrollmentsData) {
          enrollmentsData.forEach(enrollment => {
            if (enrollment.section) {
              enrollmentMap.set(enrollment.student_id, {
                id: enrollment.section.id,
                name: enrollment.section.name
              });
            }
          });
        }
        
        // Format students from admissions data
        const formattedStudents: Student[] = (admissionsData || [])
          .filter(admission => admission.student !== null)
          .map((admission: any) => {
            const enrollment = enrollmentMap.get(admission.student_id);
            const studentData = {
              id: admission.student.id,
              name: admission.student.name,
              email: studentEmailMap.get(admission.student_id) || '',
              phone: '',
              role: 'student' as const,
              schoolId: admission.student.school_id || '',
              schoolName: admission.student.school?.name || '',
              grade: admission.grade?.name || 'Unknown Grade',
              sectionId: enrollment?.id || '',
              sectionName: enrollment?.name || 'Not enrolled'
            };
            return {
              ...studentData,
              gradeId: admission.grade_id,
              dateOfBirth: admission.student.date_of_birth || '',
              admissionStatus: admission.status,
              admittedBy: admission.admitted_by
            };
          });
        
        const formattedTeachers: Teacher[] = (teachersData || []).map((teacher: any) => {
          const schoolName = teacher.school?.name;
          
          return {
            id: teacher.id,
            name: teacher.name || 'No Name',
            email: emailMap.get(teacher.id) || 'Not provided',
            phone: 'Not provided',
            role: teacher.role as 'teacher' | 'staff' | 'school_admin',
            schoolId: teacher.school_id || '',
            schoolName: schoolName || 'No School',
            subjects: [],
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
