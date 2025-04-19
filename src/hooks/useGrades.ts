import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Grade } from '@/types';

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
      
      // Transform snake_case to camelCase for the frontend
      const formattedGrades = (data || []).map(grade => ({
        id: grade.id,
        name: grade.name,
        level: grade.level,
        tenantId: grade.tenant_id,
        createdAt: grade.created_at,
        updatedAt: grade.updated_at
      }));
      
      setGrades(formattedGrades);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addGrade = async (grade: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Transform camelCase to snake_case for the database
      const { error } = await supabase.from('grades').insert([{
        name: grade.name,
        level: grade.level,
        tenant_id: grade.tenantId
      }]);
      
      if (error) throw error;
      await fetchGrades();
      return true;
    } catch (error) {
      console.error('Error adding grade:', error);
      return false;
    }
  };

  const updateGrade = async (id: string, grade: Partial<Grade>) => {
    try {
      // Transform camelCase to snake_case for the database
      const { error } = await supabase
        .from('grades')
        .update({
          name: grade.name,
          level: grade.level,
          tenant_id: grade.tenantId
        })
        .eq('id', id);
        
      if (error) throw error;
      await fetchGrades();
      return true;
    } catch (error) {
      console.error('Error updating grade:', error);
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
      return true;
    } catch (error) {
      console.error('Error deleting grade:', error);
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
