
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface School {
  id: string;
  name: string;
}

export const useSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('id, name');
      
      if (schoolsError) throw schoolsError;
      
      const formattedSchools = schoolsData.map(school => ({
        id: school.id,
        name: school.name
      }));
      
      setSchools(formattedSchools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Failed to load schools');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    schools,
    isLoading
  };
};
