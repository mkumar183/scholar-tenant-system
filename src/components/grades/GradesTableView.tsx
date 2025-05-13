import React from 'react';
import { Grade } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GradesTableViewProps {
  grades: Grade[];
  onGradeSelect: (gradeId: string) => void;
  onGradeEdit: (grade: Grade) => void;
  selectedGradeId: string | null;
}

const GradesTableView = ({
  grades,
  onGradeSelect,
  onGradeEdit,
  selectedGradeId,
}: GradesTableViewProps) => {
  return (
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
          <TableRow 
            key={grade.id} 
            className={`cursor-pointer hover:bg-muted/50 ${selectedGradeId === grade.id ? 'bg-muted' : ''}`}
            onClick={() => onGradeSelect(grade.id)}
          >
            <TableCell>{grade.name}</TableCell>
            <TableCell>{grade.level}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onGradeEdit(grade);
                }}
              >
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {grades.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              <p className="text-muted-foreground">No grades found</p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default GradesTableView;