import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Student } from '@/types';

type AdmissionWithStudent = {
  id: string;
  grade_id: string;
  status: string;
  admitted_by: string;
  student: {
    id: string;
    name: string;
    role: string;
    school_id: string;
    date_of_birth: string;
  } | null;
};

export const useStudents = (gradeId?: string) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      console.log('useStudents - Starting fetch with gradeId:', gradeId);
      
      if (!gradeId) {
        setStudents([]);
        setIsLoading(false);
        return;
      }

      // First get all sections for this grade
      const { data: sections } = await supabase
        .from('sections')
        .select('id')
        .eq('grade_id', gradeId);

      if (!sections || sections.length === 0) {
        setStudents([]);
        setIsLoading(false);
        return;
      }

      // Get all enrolled students in these sections
      const { data: enrolledStudents } = await supabase
        .from('student_section_enrollments')
        .select('student_id')
        .eq('status', 'active')
        .in('section_id', sections.map(s => s.id));

      const enrolledStudentIds = enrolledStudents?.map(e => e.student_id) || [];

      // Get all admitted students for this grade
      const { data, error } = await supabase
        .from('student_admissions')
        .select(`
          id,
          grade_id,
          status,
          admitted_by,
          student:users!student_id (
            id,
            name,
            role,
            school_id,
            date_of_birth
          )
        `)
        .eq('status', 'active')
        .eq('grade_id', gradeId);

      if (error) {
        console.error('useStudents - Error in query:', error);
        throw error;
      }

      console.log('useStudents - Raw data from query:', data);
      console.log('useStudents - Number of records:', data?.length || 0);

      const formattedStudents = (data as unknown as AdmissionWithStudent[])
        .map(admission => {
          console.log('useStudents - Processing admission:', admission);
          if (!admission.student) {
            console.log('useStudents - Skipping admission with null student');
            return null;
          }
          const student = admission.student;
          // Skip if student is already enrolled
          if (enrolledStudentIds.includes(student.id)) {
            return null;
          }
          return {
            id: student.id,
            name: student.name,
            role: 'student' as const,
            schoolId: student.school_id,
            dateOfBirth: student.date_of_birth,
            gradeId: admission.grade_id,
            admissionStatus: admission.status,
            admittedBy: admission.admitted_by,
            guardianName: 'Not specified'
          } as Student;
        })
        .filter((student): student is Student => student !== null);

      console.log('useStudents - Formatted students:', formattedStudents);
      console.log('useStudents - Number of formatted students:', formattedStudents.length);
      setStudents(formattedStudents);
    } catch (error) {
      console.error('useStudents - Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useStudents - Effect triggered with gradeId:', gradeId);
    fetchStudents();
  }, [gradeId]);

  return { students, isLoading };
};
