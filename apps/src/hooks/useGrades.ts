
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface Grade {
  id: string;
  name: string;
  description: string | null;
  school_id: string;
  academic_year: string;
  created_at: string;
  updated_at: string;
}

export const useGrades = (schoolId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const { data: grades = [], isLoading } = useQuery({
    queryKey: ["grades", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("school_id", schoolId)
        .order("name");
      
      if (error) {
        console.error("Error fetching grades:", error);
        toast({
          title: "Error fetching grades",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    },
    enabled: !!schoolId,
  });

  const createGradeMutation = useMutation({
    mutationFn: async (newGrade: { 
      name: string; 
      description: string | null; 
      school_id: string;
      school_year: string;
    }) => {
      const { data, error } = await supabase
        .from("classes")
        .insert([newGrade])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades", schoolId] });
      toast({
        title: "Grade created",
        description: "Grade has been successfully created.",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Error creating grade:", error);
      toast({
        title: "Error creating grade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateGradeMutation = useMutation({
    mutationFn: async ({ 
      id, 
      ...updates 
    }: { 
      id: string; 
      name?: string; 
      description?: string | null;
      school_year?: string;
    }) => {
      const { data, error } = await supabase
        .from("classes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades", schoolId] });
      toast({
        title: "Grade updated",
        description: "Grade has been successfully updated.",
      });
      setIsDialogOpen(false);
      setSelectedGrade(null);
    },
    onError: (error: any) => {
      console.error("Error updating grade:", error);
      toast({
        title: "Error updating grade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteGradeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades", schoolId] });
      toast({
        title: "Grade deleted",
        description: "Grade has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting grade:", error);
      toast({
        title: "Error deleting grade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateGrade = (formData: { 
    name: string; 
    description: string; 
    academicYear: string;
  }) => {
    if (!schoolId) {
      toast({
        title: "Error",
        description: "School ID is required",
        variant: "destructive",
      });
      return;
    }

    createGradeMutation.mutate({
      name: formData.name,
      description: formData.description || null,
      school_id: schoolId,
      school_year: formData.academicYear,
    });
  };

  const handleUpdateGrade = (formData: { 
    name: string; 
    description: string; 
    academicYear: string;
  }) => {
    if (!selectedGrade) return;

    updateGradeMutation.mutate({
      id: selectedGrade.id,
      name: formData.name,
      description: formData.description || null,
      school_year: formData.academicYear,
    });
  };

  const handleDeleteGrade = (id: string) => {
    if (confirm("Are you sure you want to delete this grade?")) {
      deleteGradeMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setSelectedGrade(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsDialogOpen(true);
  };

  return {
    grades,
    isLoading,
    isDialogOpen,
    selectedGrade,
    openCreateDialog,
    openEditDialog,
    closeDialog: () => setIsDialogOpen(false),
    handleCreateGrade,
    handleUpdateGrade,
    handleDeleteGrade,
    isCreating: createGradeMutation.isPending,
    isUpdating: updateGradeMutation.isPending,
    isDeleting: deleteGradeMutation.isPending,
  };
};
