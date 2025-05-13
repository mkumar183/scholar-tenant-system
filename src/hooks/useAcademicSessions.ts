
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { AcademicSession } from '@/types/database.types';

export interface UseAcademicSessionsResult {
  sessions: AcademicSession[];
  isLoading: boolean;
  error: Error | null;
  fetchSessions: () => Promise<void>;
  createSession: (session: Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>) => Promise<AcademicSession | null>;
  updateSession: (id: string, updates: Partial<Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>>) => Promise<AcademicSession | null>;
  deleteSession: (id: string) => Promise<boolean>;
  setActiveSession: (id: string) => Promise<boolean>;
}

export const useAcademicSessions = (): UseAcademicSessionsResult => {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchSessions = async () => {
    if (!user?.tenantId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('academic_sessions')
        .select('*')
        .eq('tenant_id', user.tenantId)
        .order('start_date', { ascending: false });

      if (error) throw new Error(error.message);

      setSessions(data);
    } catch (err: any) {
      console.error('Error fetching academic sessions:', err);
      setError(err);
      toast.error('Failed to load academic sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async (session: Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>): Promise<AcademicSession | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('academic_sessions')
        .insert(session)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setSessions(prev => [data, ...prev]);
      toast.success('Academic session created successfully');
      return data;
    } catch (err: any) {
      console.error('Error creating academic session:', err);
      setError(err);
      toast.error('Failed to create academic session');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = async (
    id: string, 
    updates: Partial<Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<AcademicSession | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('academic_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setSessions(prev => prev.map(session => 
        session.id === id ? { ...session, ...data } : session
      ));
      
      toast.success('Academic session updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating academic session:', err);
      setError(err);
      toast.error('Failed to update academic session');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('academic_sessions')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      setSessions(prev => prev.filter(session => session.id !== id));
      toast.success('Academic session deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting academic session:', err);
      setError(err);
      toast.error('Failed to delete academic session');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveSession = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // First, set all sessions to inactive
      await supabase
        .from('academic_sessions')
        .update({ is_active: false })
        .eq('tenant_id', user?.tenantId);

      // Then set the selected session to active
      const { error } = await supabase
        .from('academic_sessions')
        .update({ is_active: true })
        .eq('id', id);

      if (error) throw new Error(error.message);

      // Update local state
      setSessions(prev => prev.map(session => ({
        ...session,
        is_active: session.id === id
      })));

      toast.success('Active academic session updated');
      return true;
    } catch (err: any) {
      console.error('Error setting active session:', err);
      setError(err);
      toast.error('Failed to set active session');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user?.tenantId]);

  return {
    sessions,
    isLoading,
    error,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
    setActiveSession
  };
};
