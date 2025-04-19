
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStudents } from '@/hooks/useStudents';

interface EnrollStudentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  gradeId: string;
  onEnroll: (studentIds: string[]) => Promise<void>;
}

export const EnrollStudentsDialog = ({
  isOpen,
  onClose,
  sectionId,
  gradeId,
  onEnroll,
}: EnrollStudentsDialogProps) => {
  const { students, isLoading } = useStudents(gradeId);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleSubmit = async () => {
    await onEnroll(selectedStudents);
    setSelectedStudents([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll Students</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-4 text-center">Loading students...</div>
        ) : (
          <>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={student.id}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStudents([...selectedStudents, student.id]);
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                        }
                      }}
                    />
                    <label htmlFor={student.id} className="text-sm font-medium">
                      {student.name}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button 
                onClick={handleSubmit}
                disabled={selectedStudents.length === 0}
              >
                Enroll Selected Students
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
