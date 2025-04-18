import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Teacher, Student, School } from '@/types';

export const useUserData = (
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>,
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>,
  setSchools: React.Dispatch<React.SetStateAction<School[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.tenantId) return;

      try {
        setIsLoading(true);

        // Fetch schools
        const { data: schoolsData } = await supabase
          .from('schools')
          .select('id, name')
          .eq('tenant_id', user.tenantId);

        const schools = schoolsData || [];
        setSchools(schools.map(school => ({
          id: school.id,
          name: school.name
        })));

        // Fetch teachers
        const { data: teachersData } = await supabase
          .from('users')
          .select(`
            id,
            name,
            role,
            school_id,
            schools:school_id (
              name
            )
          `)
          .eq('tenant_id', user.tenantId)
          .in('role', ['teacher', 'staff', 'school_admin']);

        if (teachersData) {
          const formattedTeachers = teachersData.map(teacher => ({
            id: teacher.id,
            name: teacher.name || '',
            email: '',  // We'll get this from auth.users
            phone: '',
            role: teacher.role as 'teacher' | 'staff' | 'school_admin',
            schoolId: teacher.school_id || '',
            schoolName: teacher.schools?.name || '',
            subjects: []
          }));

          setTeachers(formattedTeachers);
        }

        // Fetch students
        const { data: studentsData } = await supabase
          .from('users')
          .select(`
            id,
            name,
            role,
            school_id,
            date_of_birth,
            schools:school_id (
              name
            )
          `)
          .eq('tenant_id', user.tenantId)
          .eq('role', 'student');

        if (studentsData) {
          const formattedStudents = studentsData.map(student => ({
            id: student.id,
            name: student.name || '',
            email: '',  // We'll get this from auth.users
            phone: '',
            role: 'student',
            schoolId: student.school_id || '',
            schoolName: student.schools?.name || '',
            guardianName: '',
            dateOfBirth: student.date_of_birth || undefined
          }));

          setStudents(formattedStudents);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.tenantId, setTeachers, setStudents, setSchools, setIsLoading]);
};
