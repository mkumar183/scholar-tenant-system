
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
    password: string;
    role: string;
  };
  setNewTeacher: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    password: string;
    role: string;
  }>>;
  newStudent: {
    name: string;
    email: string;
    phone: string;
    guardianName: string;
    dateOfBirth: string;
  };
  setNewStudent: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    guardianName: string;
    dateOfBirth: string;
  }>>;
  handleAddTeacher: () => void;
  handleAddStudent: () => void;
  schools: { id: string; name: string }[];
  grades?: string[]; // Add the optional grades property
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
  grades // Add it to the component props
}: AddUserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add {activeTab === 'teachers' ? 'Staff' : 'Student'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {activeTab === 'teachers' ? 'Staff' : 'Student'}</DialogTitle>
          <DialogDescription>
            Register a new {activeTab === 'teachers' ? 'staff member' : 'student'} in the system
          </DialogDescription>
        </DialogHeader>
        
        {activeTab === 'teachers' ? (
          <AddTeacherForm 
            newTeacher={newTeacher} 
            setNewTeacher={setNewTeacher} 
            schools={schools}
          />
        ) : (
          <AddStudentForm 
            newStudent={newStudent} 
            setNewStudent={setNewStudent}
          />
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={activeTab === 'teachers' ? handleAddTeacher : handleAddStudent}>
            Add {activeTab === 'teachers' ? 'Staff' : 'Student'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
