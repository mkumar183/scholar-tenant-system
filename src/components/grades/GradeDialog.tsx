
import { useState, useEffect } from 'react';
import { Grade } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GradeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (grade: Partial<Grade>) => void;
  initialGrade?: Grade | null;
  gradeOptions: { name: string; level: number }[];
  isEditMode: boolean;
}

const GradeDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialGrade,
  gradeOptions,
  isEditMode,
}: GradeDialogProps) => {
  const [newGrade, setNewGrade] = useState<{
    name: string;
    level: number;
  }>({
    name: '',
    level: 0,
  });

  useEffect(() => {
    if (initialGrade) {
      setNewGrade({
        name: initialGrade.name,
        level: initialGrade.level,
      });
    } else {
      setNewGrade({ name: '', level: 0 });
    }
  }, [initialGrade, isOpen]);

  const handleSubmit = () => {
    onSubmit(newGrade);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Grade Name</label>
            <Input
              value={newGrade.name}
              onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
              placeholder="Enter grade name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Grade Level</label>
            <Select
              value={newGrade.level.toString()}
              onValueChange={(value) => setNewGrade({ ...newGrade, level: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade.level} value={grade.level.toString()}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit}>
            {isEditMode ? 'Update Grade' : 'Add Grade'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradeDialog;
