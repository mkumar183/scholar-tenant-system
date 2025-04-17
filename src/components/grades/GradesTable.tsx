
import { Grade } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GradesTableProps {
  grades: Grade[];
  onGradeSelect: (gradeId: string) => void;
  onGradeEdit?: (grade: Grade) => void;
  selectedGradeId: string | null;
  canManageGrades: boolean;
}

const GradesTable = ({
  grades,
  onGradeSelect,
  onGradeEdit,
  selectedGradeId,
  canManageGrades,
}: GradesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Level</TableHead>
          {canManageGrades && <TableHead>Actions</TableHead>}
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
            {canManageGrades && (
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      if (onGradeEdit) onGradeEdit(grade);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
        {grades.length === 0 && (
          <TableRow>
            <TableCell colSpan={canManageGrades ? 3 : 2} className="text-center py-4">
              <p className="text-muted-foreground">No grades found</p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default GradesTable;
