
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { StudentAdmission, Student } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAdmissions = () => {
  const [admissions, setAdmissions] = useState<StudentAdmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchAdmissions = async () => {
    setIsLoading(true);
    try {
      // If school admin, only fetch for their school
      const query = supabase
        .from('student_admissions')
        .select(`
          id,
          student_id,
          school_id,
          grade_id,
          admission_date,
          status,
          remarks,
          admitted_by,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (user?.role === 'school_admin' && user?.schoolId) {
        query.eq('school_id', user.schoolId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAdmissions(data || []);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      toast.error('Failed to load admissions');
    } finally {
      setIsLoading(false);
    }
  };

  const createAdmission = async (admission: {
    student_id?: string;
    school_id: string;
    grade_id: string;
    admission_date: string;
    status: 'pending';
    remarks?: string;
    newStudent?: {
      name: string;
      email: string;
      dateOfBirth?: string;
      guardianName?: string;
    };
  }) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');
      
      let studentId = admission.student_id;
      
      // If a new student needs to be created
      if (admission.newStudent) {
        // 1. Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: admission.newStudent.email,
          password: `Temp${Math.floor(100000 + Math.random() * 900000)}`, // Temporary password
          options: {
            data: {
              name: admission.newStudent.name,
              role: 'student'
            }
          }
        });
        
        if (authError) {
          console.error('Error creating auth user:', authError);
          throw new Error(`Failed to create student account: ${authError.message}`);
        }
        
        if (!authData.user) {
          throw new Error('Failed to create student account');
        }
        
        studentId = authData.user.id;
        
        // 2. Create user in public.users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: studentId,
            name: admission.newStudent.name,
            role: 'student',
            tenant_id: user.tenantId,
            date_of_birth: admission.newStudent.dateOfBirth || null
          });
        
        if (userError) {
          console.error('Error creating user record:', userError);
          throw new Error(`Failed to create student profile: ${userError.message}`);
        }
        
        toast.success('New student account created successfully');
      }
      
      if (!studentId) {
        throw new Error('No student selected or created');
      }

      // Create the admission record
      const { data, error } = await supabase
        .from('student_admissions')
        .insert([{ 
          student_id: studentId, 
          school_id: admission.school_id,
          grade_id: admission.grade_id,
          admission_date: admission.admission_date,
          status: admission.status,
          remarks: admission.remarks || null,
          admitted_by: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      
      setAdmissions([data, ...admissions]);
      toast.success('Student admission created successfully');
      return true;
    } catch (error: any) {
      console.error('Error creating admission:', error);
      toast.error(`Failed to create admission: ${error.message}`);
      return false;
    }
  };

  const updateAdmissionStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      // Start a transaction
      if (status === 'approved') {
        // First get the admission record
        const { data: admissionData, error: getError } = await supabase
          .from('student_admissions')
          .select('student_id, school_id')
          .eq('id', id)
          .single();
        
        if (getError) throw getError;
        
        // Update the user's school_id when admission is approved
        const { error: userError } = await supabase
          .from('users')
          .update({ school_id: admissionData.school_id })
          .eq('id', admissionData.student_id);
        
        if (userError) throw userError;
      }
      
      // Update the admission status
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
    } catch (error: any) {
      console.error('Error updating admission:', error);
      toast.error(`Failed to update admission status: ${error.message}`);
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
