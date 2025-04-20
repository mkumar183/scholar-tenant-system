
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grade } from '@/types';
import GradeDialog from '@/components/grades/GradeDialog';

interface GradesHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  handleAddOrUpdateGrade: (newGradeData: Partial<Grade>) => Promise<void>;
  selectedGrade: Grade | null;
  gradeOptions: { name: string; level: number }[];
  isEditMode: boolean;
  canManageGrades: boolean;
}

const GradesHeader = ({
  isDialogOpen,
  setIsDialogOpen,
  handleAddOrUpdateGrade,
  selectedGrade,
  gradeOptions,
  isEditMode,
  canManageGrades
}: GradesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Grades</h1>
      {canManageGrades && (
        <>
          <GradeDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleAddOrUpdateGrade}
            initialGrade={selectedGrade}
            gradeOptions={gradeOptions}
            isEditMode={isEditMode}
          />
          
          <Button onClick={() => {
            setIsDialogOpen(true);
          }}>
            Add Grade
          </Button>
        </>
      )}
    </div>
  );
};

export default GradesHeader;
