
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Term } from '@/types/database.types';

export interface UseTermsResult {
  terms: Term[];
  isLoading: boolean;
  error: Error | null;
  fetchTerms: (academicSessionId: string) => Promise<void>;
  createTerm: (term: Omit<Term, 'id' | 'created_at' | 'updated_at'>) => Promise<Term | null>;
  updateTerm: (id: string, updates: Partial<Omit<Term, 'id' | 'created_at' | 'updated_at'>>) => Promise<Term | null>;
  deleteTerm: (id: string) => Promise<boolean>;
}

export const useTerms = (): UseTermsResult => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTerms = async (academicSessionId: string) => {
    if (!academicSessionId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('terms')
        .select('*')
        .eq('academic_session_id', academicSessionId)
        .order('start_date', { ascending: true });

      if (error) throw new Error(error.message);

      setTerms(data);
    } catch (err: any) {
      console.error('Error fetching terms:', err);
      setError(err);
      toast.error('Failed to load terms');
    } finally {
      setIsLoading(false);
    }
  };

  const createTerm = async (term: Omit<Term, 'id' | 'created_at' | 'updated_at'>): Promise<Term | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('terms')
        .insert(term)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setTerms(prev => [...prev, data]);
      toast.success('Term created successfully');
      return data;
    } catch (err: any) {
      console.error('Error creating term:', err);
      setError(err);
      toast.error('Failed to create term');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTerm = async (
    id: string, 
    updates: Partial<Omit<Term, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Term | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('terms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setTerms(prev => prev.map(term => 
        term.id === id ? { ...term, ...data } : term
      ));
      
      toast.success('Term updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating term:', err);
      setError(err);
      toast.error('Failed to update term');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTerm = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('terms')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      setTerms(prev => prev.filter(term => term.id !== id));
      toast.success('Term deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting term:', err);
      setError(err);
      toast.error('Failed to delete term');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    terms,
    isLoading,
    error,
    fetchTerms,
    createTerm,
    updateTerm,
    deleteTerm
  };
};
