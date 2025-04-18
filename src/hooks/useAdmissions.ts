
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { StudentAdmission } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAdmissions = () => {
  const [admissions, setAdmissions] = useState<StudentAdmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchAdmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('student_admissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmissions(data || []);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      toast.error('Failed to load admissions');
    } finally {
      setIsLoading(false);
    }
  };

  const createAdmission = async (admission: Omit<StudentAdmission, 'id' | 'created_at' | 'updated_at' | 'admitted_by'>) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('student_admissions')
        .insert([{ ...admission, admitted_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setAdmissions([data, ...admissions]);
      toast.success('Student admission created successfully');
      return true;
    } catch (error) {
      console.error('Error creating admission:', error);
      toast.error('Failed to create admission');
      return false;
    }
  };

  const updateAdmissionStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('student_admissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setAdmissions(admissions.map(admission => 
        admission.id === id ? { ...admission, status } : admission
      ));
      
      toast.success(`Admission ${status} successfully`);
      return true;
    } catch (error) {
      console.error('Error updating admission:', error);
      toast.error('Failed to update admission status');
      return false;
    }
  };

  return {
    admissions,
    isLoading,
    fetchAdmissions,
    createAdmission,
    updateAdmissionStatus
  };
};
