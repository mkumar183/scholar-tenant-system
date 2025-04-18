
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdmitStudentDialogProps {
  students: Student[];
  grades: Grade[];
  schoolId: string;
  onSubmit: (values: {
    student_id?: string;
    grade_id: string;
    admission_date: string;
    remarks: string;
    school_id: string;
    status: 'pending';
    newStudent?: {
      name: string;
      email: string;
      dateOfBirth?: string;
      guardianName?: string;
    };
  }) => Promise<boolean>;
}

const AdmitStudentDialog = ({
  students,
  grades,
  schoolId,
  onSubmit
}: AdmitStudentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');
  
  const [formData, setFormData] = useState({
    student_id: '',
    grade_id: '',
    admission_date: new Date().toISOString().split('T')[0],
    remarks: '',
  });
  
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    guardianName: '',
  });

  const handleSubmit = async () => {
    const submissionData = {
      ...formData,
      school_id: schoolId,
      status: 'pending' as const
    };
    
    // If creating a new student
    if (activeTab === 'new') {
      const success = await onSubmit({
        ...submissionData,
        newStudent: newStudentData
      });
      
      if (success) {
        resetForm();
        setIsOpen(false);
      }
    } else {
      // If using existing student
      const success = await onSubmit(submissionData);
      
      if (success) {
        resetForm();
        setIsOpen(false);
      }
    }
  };
  
  const resetForm = () => {
    setFormData({
      student_id: '',
      grade_id: '',
      admission_date: new Date().toISOString().split('T')[0],
      remarks: '',
    });
    
    setNewStudentData({
      name: '',
      email: '',
      dateOfBirth: '',
      guardianName: '',
    });
    
    setActiveTab('existing');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Admit New Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Admit Student</DialogTitle>
          <DialogDescription>
            Fill in the details to admit a student to the school
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="existing">Existing Student</TabsTrigger>
            <TabsTrigger value="new">New Student</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing">
            <div className="grid gap-4 py-2">
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
                    {students
                      .filter(s => !s.schoolId)
                      .map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  value={newStudentData.name}
                  onChange={(e) =>
                    setNewStudentData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Full name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudentData.email}
                  onChange={(e) =>
                    setNewStudentData(prev => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Email address"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newStudentData.dateOfBirth}
                  onChange={(e) =>
                    setNewStudentData(prev => ({ ...prev, dateOfBirth: e.target.value }))
                  }
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={newStudentData.guardianName}
                  onChange={(e) =>
                    setNewStudentData(prev => ({ ...prev, guardianName: e.target.value }))
                  }
                  placeholder="Guardian or parent name"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid gap-4 py-2">
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
              placeholder="Optional notes about this admission"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={(activeTab === 'existing' && !formData.student_id) || 
              (activeTab === 'new' && (!newStudentData.name || !newStudentData.email)) ||
              !formData.grade_id}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdmitStudentDialog;
