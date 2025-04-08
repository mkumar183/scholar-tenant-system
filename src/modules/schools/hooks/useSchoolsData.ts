
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface School {
  id: string;
  name: string;
  address?: string;
  type?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export const useSchoolsData = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('schools')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setSchools(data || []);
    } catch (err: any) {
      console.error('Error fetching schools:', err);
      setError(err.message || 'Failed to fetch schools');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSchools();
    }
  }, [user]);

  return { schools, isLoading, error, fetchSchools, setSchools };
};

