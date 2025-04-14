
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Holiday } from '@/types/database.types';

export interface UseHolidaysResult {
  holidays: Holiday[];
  isLoading: boolean;
  error: Error | null;
  fetchHolidays: (academicSessionId: string) => Promise<void>;
  createHoliday: (holiday: Omit<Holiday, 'id' | 'created_at' | 'updated_at'>) => Promise<Holiday | null>;
  updateHoliday: (id: string, updates: Partial<Omit<Holiday, 'id' | 'created_at' | 'updated_at'>>) => Promise<Holiday | null>;
  deleteHoliday: (id: string) => Promise<boolean>;
}

export const useHolidays = (): UseHolidaysResult => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHolidays = async (academicSessionId: string) => {
    if (!academicSessionId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .eq('academic_session_id', academicSessionId)
        .order('date', { ascending: true });

      if (error) throw new Error(error.message);

      setHolidays(data);
    } catch (err: any) {
      console.error('Error fetching holidays:', err);
      setError(err);
      toast.error('Failed to load holidays');
    } finally {
      setIsLoading(false);
    }
  };

  const createHoliday = async (holiday: Omit<Holiday, 'id' | 'created_at' | 'updated_at'>): Promise<Holiday | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('holidays')
        .insert(holiday)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setHolidays(prev => [...prev, data]);
      toast.success('Holiday created successfully');
      return data;
    } catch (err: any) {
      console.error('Error creating holiday:', err);
      setError(err);
      toast.error('Failed to create holiday');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateHoliday = async (
    id: string, 
    updates: Partial<Omit<Holiday, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Holiday | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('holidays')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setHolidays(prev => prev.map(holiday => 
        holiday.id === id ? { ...holiday, ...data } : holiday
      ));
      
      toast.success('Holiday updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating holiday:', err);
      setError(err);
      toast.error('Failed to update holiday');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHoliday = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      setHolidays(prev => prev.filter(holiday => holiday.id !== id));
      toast.success('Holiday deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting holiday:', err);
      setError(err);
      toast.error('Failed to delete holiday');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    holidays,
    isLoading,
    error,
    fetchHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday
  };
};
