
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { SectionEnrollment } from '@/types';

export const useSectionEnrollments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [enrollments, setEnrollments] = useState<SectionEnrollment[]>([]);

  const fetchEnrollments = async (sectionId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('current_section_enrollments')
        .select('*')
        .eq('section_id', sectionId);

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to fetch enrollments');
    } finally {
      setIsLoading(false);
    }
  };

  const enrollStudent = async (
    studentId: string,
    sectionId: string,
    enrolledBy: string,
    notes?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('student_section_enrollments')
        .insert([
          {
            student_id: studentId,
            section_id: sectionId,
            enrolled_by: enrolledBy,
            status: 'active',
            notes
          }
        ])
        .select()
        .single();

      if (error) throw error;
      toast.success('Student enrolled successfully');
      return data;
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast.error('Failed to enroll student');
      return null;
    }
  };

  const updateEnrollmentStatus = async (
    enrollmentId: string,
    status: 'transferred' | 'withdrawn',
    notes?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('student_section_enrollments')
        .update({ status, notes })
        .eq('id', enrollmentId)
        .select()
        .single();

      if (error) throw error;
      toast.success(`Enrollment ${status} successfully`);
      return data;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      toast.error('Failed to update enrollment');
      return null;
    }
  };

  return {
    enrollments,
    isLoading,
    fetchEnrollments,
    enrollStudent,
    updateEnrollmentStatus
  };
};
