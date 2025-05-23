import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { StudentAdmission } from '@/types';

export const useStudentAdmissions = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createStudentAdmission = async (
    studentId: string,
    schoolId: string,
    gradeId: string,
    remarks?: string,
    academicSessionId?: string
  ) => {
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('student_admissions')
        .insert({
          student_id: studentId,
          school_id: schoolId,
          grade_id: gradeId,
          admitted_by: user.id,
          status: 'active',
          remarks: remarks || null,
          academic_session_id: academicSessionId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Student admitted successfully');
      return data as StudentAdmission;
      
    } catch (error: any) {
      console.error('Error creating student admission:', error);
      toast.error(`Failed to admit student: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStudentAdmissions = async (studentId?: string) => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('student_admissions')
        .select(`
          *,
          student:student_id(id, name),
          school:school_id(id, name),
          grade:grade_id(id, name)
        `);
        
      if (studentId) {
        query = query.eq('student_id', studentId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as any[];
      
    } catch (error: any) {
      console.error('Error fetching student admissions:', error);
      toast.error(`Failed to fetch admissions: ${error.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateAdmissionStatus = async (admissionId: string, status: 'active' | 'inactive' | 'pending') => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('student_admissions')
        .update({ status })
        .eq('id', admissionId)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success(`Admission status updated to ${status}`);
      return data as StudentAdmission;
      
    } catch (error: any) {
      console.error('Error updating admission status:', error);
      toast.error(`Failed to update status: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createStudentAdmission,
    getStudentAdmissions,
    updateAdmissionStatus
  };
};
