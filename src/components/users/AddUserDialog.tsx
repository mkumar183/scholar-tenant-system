
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
import { Plus } from 'lucide-react';
import AddTeacherForm from './AddTeacherForm';
import AddStudentForm from './AddStudentForm';

interface AddUserDialogProps {
  activeTab: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newTeacher: {
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    subjects: string[];
  };
  setNewTeacher: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    subjects: string[];
  }>>;
  newStudent: {
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    grade: string;
    guardianName: string;
  };
  setNewStudent: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    grade: string;
    guardianName: string;
  }>>;
  handleAddTeacher: () => void;
  handleAddStudent: () => void;
  schools: { id: string; name: string }[];
  subjects: string[];
  grades: string[];
}

const AddUserDialog = ({
  activeTab,
  isOpen,
  setIsOpen,
  newTeacher,
  setNewTeacher,
  newStudent,
  setNewStudent,
  handleAddTeacher,
  handleAddStudent,
  schools,
  subjects,
  grades
}: AddUserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {activeTab === 'teachers' ? 'Teacher' : 'Student'}</DialogTitle>
          <DialogDescription>
            Register a new {activeTab === 'teachers' ? 'teacher' : 'student'} in the system
          </DialogDescription>
        </DialogHeader>
        
        {activeTab === 'teachers' ? (
          <AddTeacherForm 
            newTeacher={newTeacher} 
            setNewTeacher={setNewTeacher} 
            schools={schools} 
            subjects={subjects} 
          />
        ) : (
          <AddStudentForm 
            newStudent={newStudent} 
            setNewStudent={setNewStudent} 
            schools={schools} 
            grades={grades} 
          />
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={activeTab === 'teachers' ? handleAddTeacher : handleAddStudent}>
            Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
