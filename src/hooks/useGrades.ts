
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Grade } from '@/types';
import { toast } from 'sonner';

export const useGrades = (tenantId: string) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('level', { ascending: true });

      if (error) throw error;
      
      const formattedGrades: Grade[] = (data || []).map(grade => ({
        id: grade.id,
        name: grade.name,
        level: grade.level,
        tenant_id: grade.tenant_id,
        created_at: grade.created_at,
        updated_at: grade.updated_at
      }));
      
      setGrades(formattedGrades);
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast.error('Failed to fetch grades');
    } finally {
      setIsLoading(false);
    }
  };

  const addGrade = async (grade: Omit<Grade, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('grades').insert([{
        name: grade.name,
        level: grade.level,
        tenant_id: grade.tenant_id
      }]);
      
      if (error) throw error;
      await fetchGrades();
      toast.success('Grade added successfully');
      return true;
    } catch (error) {
      console.error('Error adding grade:', error);
      toast.error('Failed to add grade');
      return false;
    }
  };

  const updateGrade = async (id: string, grade: Partial<Grade>) => {
    try {
      const { error } = await supabase
        .from('grades')
        .update({
          name: grade.name,
          level: grade.level,
          tenant_id: grade.tenant_id
        })
        .eq('id', id);
        
      if (error) throw error;
      await fetchGrades();
      toast.success('Grade updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating grade:', error);
      toast.error('Failed to update grade');
      return false;
    }
  };

  const deleteGrade = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchGrades();
      toast.success('Grade deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting grade:', error);
      toast.error('Failed to delete grade');
      return false;
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchGrades();
    } else {
      setIsLoading(false);
    }
  }, [tenantId]);

  return { grades, isLoading, addGrade, updateGrade, deleteGrade };
};
