
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student } from '@/types';
import { useStudents } from '@/hooks/useStudents';
import { Textarea } from '@/components/ui/textarea';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';

interface EnrollStudentsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: string;
  gradeId: string;
  academicSessionId: string;
  onSuccess?: () => void;
}

const EnrollStudentsDialog = ({
  isOpen,
  onOpenChange,
  sectionId,
  gradeId,
  academicSessionId,
  onSuccess
}: EnrollStudentsDialogProps) => {
  const { user } = useAuth();
  const { enrollStudent } = useEnrollments();
  const { getStudentsByGrade, isLoading } = useStudents();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen && gradeId) {
      getStudentsByGrade(gradeId)
        .then(fetchedStudents => {
          setStudents(fetchedStudents || []);
          // Reset selection when dialog opens or grade changes
          setSelectedStudentId('');
        })
        .catch(error => {
          console.error('Error fetching students:', error);
          toast.error('Failed to load students');
        });
    }
  }, [isOpen, gradeId, getStudentsByGrade]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when dialog closes
      setSelectedStudentId('');
      setNotes('');
    }
  }, [isOpen]);

  const handleEnroll = async () => {
    if (!selectedStudentId) {
      toast.error('Please select a student');
      return;
    }

    try {
      await enrollStudent({
        studentId: selectedStudentId,
        sectionId,
        notes,
        status: 'active'
      });
      
      toast.success('Student enrolled successfully');
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast.error('Failed to enroll student');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll Student</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Student</label>
            <Select
              value={selectedStudentId}
              onValueChange={setSelectedStudentId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.length === 0 ? (
                  <SelectItem value="no-students" disabled>No students available</SelectItem>
                ) : (
                  students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <Textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this enrollment"
              rows={3}
            />
          </div>

          <Button 
            onClick={handleEnroll} 
            disabled={!selectedStudentId || isLoading}
            className="w-full"
          >
            Enroll Student
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollStudentsDialog;
