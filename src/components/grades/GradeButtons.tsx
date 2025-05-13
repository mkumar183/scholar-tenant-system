import React from 'react';
import { Button } from '@/components/ui/button';
import { Grade } from '@/types';

interface GradeButtonsProps {
  grades: Grade[];
  selectedGradeId: string | null;
  onGradeSelect: (gradeId: string) => void;
}

const GradeButtons = ({ grades, selectedGradeId, onGradeSelect }: GradeButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {grades.map((grade) => (
        <Button
          key={grade.id}
          variant={selectedGradeId === grade.id ? "default" : "outline"}
          onClick={() => onGradeSelect(grade.id)}
          className="min-w-[80px]"
        >
          {grade.name}
        </Button>
      ))}
      {grades.length === 0 && (
        <p className="text-muted-foreground">No grades available</p>
      )}
    </div>
  );
};

export default GradeButtons;