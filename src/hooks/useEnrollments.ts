
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Enrollment {
  id: string;
  student_id: string;
  section_id: string;
  status: 'active' | 'transferred' | 'withdrawn';
  enrolled_at: string;
  enrolled_by: string;
  effective_from: string;
  effective_to?: string;
  notes?: string;
}

export const useEnrollments = (sectionId: string) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_section_enrollments')
        .select('*')
        .eq('section_id', sectionId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to fetch enrollments');
    } finally {
      setIsLoading(false);
    }
  };

  const enrollStudents = async (studentIds: string[]) => {
    try {
      const enrollments = studentIds.map(studentId => ({
        student_id: studentId,
        section_id: sectionId,
        status: 'active',
      }));

      const { error } = await supabase
        .from('student_section_enrollments')
        .insert(enrollments);

      if (error) throw error;
      
      toast.success('Students enrolled successfully');
      await fetchEnrollments();
      return true;
    } catch (error) {
      console.error('Error enrolling students:', error);
      toast.error('Failed to enroll students');
      return false;
    }
  };

  const updateEnrollmentStatus = async (enrollmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('student_section_enrollments')
        .update({ status })
        .eq('id', enrollmentId);

      if (error) throw error;
      
      toast.success('Enrollment status updated');
      await fetchEnrollments();
      return true;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      toast.error('Failed to update enrollment');
      return false;
    }
  };

  return {
    enrollments,
    enrollStudents,
    updateEnrollmentStatus,
    isLoading,
    fetchEnrollments,
  };
};
