
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Stream = {
  id: string;
  name: string;
  description: string | null;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
};

export const useStreams = () => {
  const { user } = useAuth();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStreams = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .order('name');

      if (error) throw error;

      setStreams(data.map(stream => ({
        id: stream.id,
        name: stream.name,
        description: stream.description,
        tenantId: stream.tenant_id,
        createdAt: stream.created_at,
        updatedAt: stream.updated_at
      })));
    } catch (error: any) {
      console.error('Error fetching streams:', error);
      toast.error('Failed to load streams');
    } finally {
      setIsLoading(false);
    }
  };

  const createStream = async (name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .insert([
          {
            name,
            description,
            tenant_id: user?.tenantId
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setStreams([...streams, {
        id: data.id,
        name: data.name,
        description: data.description,
        tenantId: data.tenant_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }]);
      
      toast.success('Stream created successfully');
    } catch (error: any) {
      console.error('Error creating stream:', error);
      toast.error('Failed to create stream');
      throw error;
    }
  };

  const updateStream = async (id: string, name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .update({ name, description })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStreams(streams.map(stream => 
        stream.id === id ? {
          ...stream,
          name: data.name,
          description: data.description,
          updatedAt: data.updated_at
        } : stream
      ));

      toast.success('Stream updated successfully');
    } catch (error: any) {
      console.error('Error updating stream:', error);
      toast.error('Failed to update stream');
      throw error;
    }
  };

  const deleteStream = async (id: string) => {
    try {
      const { error } = await supabase
        .from('streams')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStreams(streams.filter(stream => stream.id !== id));
      toast.success('Stream deleted successfully');
    } catch (error: any) {
      console.error('Error deleting stream:', error);
      toast.error('Failed to delete stream');
      throw error;
    }
  };

  return {
    streams,
    isLoading,
    fetchStreams,
    createStream,
    updateStream,
    deleteStream
  };
};
