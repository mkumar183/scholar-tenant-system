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
  existingGrades?: Grade[];
}

const GradeDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialGrade,
  gradeOptions,
  isEditMode,
  existingGrades = [],
}: GradeDialogProps) => {
  const [newGrade, setNewGrade] = useState<{
    name: string;
    level: number;
  }>({
    name: '',
    level: 0,
  });

  const availableGradeOptions = gradeOptions.filter(option => {
    if (isEditMode && initialGrade?.level === option.level) {
      return true;
    }
    return !existingGrades.some(grade => grade.level === option.level);
  });

  // Get the name for the current level
  const getGradeNameForLevel = (level: number) => {
    return gradeOptions.find(option => option.level === level)?.name || '';
  };

  useEffect(() => {
    if (initialGrade) {
      setNewGrade({
        name: initialGrade.name,
        level: initialGrade.level,
      });
    } else if (!isOpen) {
      // Only reset when dialog is closed
      const firstAvailableOption = availableGradeOptions[0];
      setNewGrade({ 
        name: '', 
        level: firstAvailableOption?.level || 0 
      });
    }
  }, [initialGrade, isOpen, availableGradeOptions]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGrade(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleLevelChange = (value: string) => {
    setNewGrade(prev => ({
      ...prev,
      level: parseInt(value)
    }));
  };

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
              onChange={handleNameChange}
              placeholder="Enter grade name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Grade Level</label>
            <Select
              value={newGrade.level.toString()}
              onValueChange={handleLevelChange}
            >
              <SelectTrigger>
                <SelectValue>
                  {getGradeNameForLevel(newGrade.level)} (Level {newGrade.level})
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableGradeOptions.map((grade) => (
                  <SelectItem key={grade.level} value={grade.level.toString()}>
                    {grade.name} (Level {grade.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} disabled={availableGradeOptions.length === 0}>
            {isEditMode ? 'Update Grade' : 'Add Grade'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradeDialog;
