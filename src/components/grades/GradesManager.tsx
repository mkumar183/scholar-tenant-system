import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Pencil } from 'lucide-react';
import GradeDialog from './GradeDialog';
import { Grade } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Grade level definitions
const GRADE_LEVELS = [
  { name: 'Nursery', level: 0 },
  { name: 'LKG', level: 1 },
  { name: 'UKG', level: 2 },
  { name: '1', level: 3 },
  { name: '2', level: 4 },
  { name: '3', level: 5 },
  { name: '4', level: 6 },
  { name: '5', level: 7 },
  { name: '6', level: 8 },
  { name: '7', level: 9 },
  { name: '8', level: 10 },
  { name: '9', level: 11 },
  { name: '10', level: 12 },
  { name: '11', level: 13 },
  { name: '12', level: 14 },
];

export const GradesManager = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  const fetchGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .eq('tenant_id', user?.tenantId)
        .order('level', { ascending: true });

      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast.error('Failed to fetch grades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [user?.tenantId]);

  const handleAddOrUpdateGrade = async (newGradeData: Partial<Grade>) => {
    try {
      const gradeData = {
        name: newGradeData.name,
        level: newGradeData.level,
        tenant_id: user?.tenantId
      };

      if (editingGrade) {
        const { error } = await supabase
          .from('grades')
          .update(gradeData)
          .eq('id', editingGrade.id);

        if (error) throw error;
        toast.success('Grade updated successfully');
      } else {
        const { error } = await supabase
          .from('grades')
          .insert([gradeData]);

        if (error) throw error;
        toast.success('Grade created successfully');
      }

      setIsDialogOpen(false);
      setEditingGrade(null);
      fetchGrades();
    } catch (error) {
      console.error('Error saving grade:', error);
      toast.error('Failed to save grade');
    }
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">Manage Grades</h4>
        <Button onClick={() => {
          setEditingGrade(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Grade
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell>{grade.name}</TableCell>
              <TableCell>{grade.level}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(grade)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {grades.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No grades found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <GradeDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddOrUpdateGrade}
        initialGrade={editingGrade}
        gradeOptions={GRADE_LEVELS}
        isEditMode={!!editingGrade}
        existingGrades={grades}
      />
    </div>
  );
}; 