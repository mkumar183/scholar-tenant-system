
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Section } from '@/types';
import { toast } from 'sonner';

export const useSections = (gradeId: string, schoolId: string | null, academicSessionId: string) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSections = async () => {
    if (!gradeId || !academicSessionId) {
      console.log('Missing required parameters for fetching sections:', { 
        gradeId, 
        schoolId, 
        academicSessionId 
      });
      setSections([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Fetching sections with params:', { 
        gradeId, 
        schoolId, 
        academicSessionId 
      });
      
      let query = supabase
        .from('sections')
        .select('*')
        .eq('grade_id', gradeId)
        .eq('academic_session_id', academicSessionId);
      
      // Only filter by school_id if it's provided
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error fetching sections:', error);
        throw error;
      }
      
      console.log('Sections fetched successfully:', data);
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("useSections useEffect triggered with dependencies:", {
      gradeId, 
      schoolId, 
      academicSessionId,
      hasAllParams: !!(gradeId && academicSessionId)
    });
    
    fetchSections();
  }, [gradeId, schoolId, academicSessionId]);

  const addSection = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .insert([
          {
            name,
            grade_id: gradeId,
            school_id: schoolId || null, // Handle null schoolId
            academic_session_id: academicSessionId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setSections([...sections, data]);
      toast.success('Section added successfully');
      return true;
    } catch (error) {
      console.error('Error adding section:', error);
      toast.error('Failed to add section');
      return false;
    }
  };

  const updateSection = async (id: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .update({ name })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSections(sections.map(section => section.id === id ? data : section));
      toast.success('Section updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
      return false;
    }
  };

  const toggleSectionStatus = async (id: string, isActive: boolean) => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSections(sections.map(section => section.id === id ? data : section));
      toast.success(`Section ${isActive ? 'activated' : 'deactivated'} successfully`);
      return true;
    } catch (error) {
      console.error('Error toggling section status:', error);
      toast.error('Failed to update section status');
      return false;
    }
  };

  return {
    sections,
    isLoading,
    fetchSections,
    addSection,
    updateSection,
    toggleSectionStatus,
  };
};
