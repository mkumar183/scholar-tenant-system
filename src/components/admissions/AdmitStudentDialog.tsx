
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Student, Grade } from '@/types';

interface AdmitStudentDialogProps {
  students: Student[];
  grades: Grade[];
  schoolId: string;
  onSubmit: (values: {
    student_id: string;
    grade_id: string;
    admission_date: string;
    remarks: string;
    school_id: string;
    status: 'pending';
  }) => Promise<boolean>;
}

const AdmitStudentDialog = ({
  students,
  grades,
  schoolId,
  onSubmit
}: AdmitStudentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    grade_id: '',
    admission_date: new Date().toISOString().split('T')[0],
    remarks: '',
  });

  const handleSubmit = async () => {
    const success = await onSubmit({
      ...formData,
      school_id: schoolId,
      status: 'pending'
    });
    if (success) {
      setIsOpen(false);
      setFormData({
        student_id: '',
        grade_id: '',
        admission_date: new Date().toISOString().split('T')[0],
        remarks: '',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Admit New Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admit Student</DialogTitle>
          <DialogDescription>
            Fill in the details to admit a new student to the school
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="student">Student</Label>
            <Select
              value={formData.student_id}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, student_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="grade">Grade</Label>
            <Select
              value={formData.grade_id}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, grade_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="admission-date">Admission Date</Label>
            <Input
              id="admission-date"
              type="date"
              value={formData.admission_date}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, admission_date: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              value={formData.remarks}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, remarks: e.target.value }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdmitStudentDialog;
