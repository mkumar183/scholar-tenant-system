import React from 'react';
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
import { Grade, School } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

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
    gradeId: string;
    schoolId: string;
    remarks: string;
  };
  setNewStudent: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    guardianName: string;
    dateOfBirth: string;
    gradeId: string;
    schoolId: string;
    remarks: string;
  }>>;
  handleAddTeacher: () => void;
  handleAddStudent: () => void;
  schools: School[];
  grades: Grade[];
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
  grades
}: AddUserDialogProps) => {
  const { user } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> {activeTab === 'teachers' ? 'Add Staff' : 'Admit Student'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activeTab === 'teachers' ? 'Add New Staff' : 'Admit New Student'}</DialogTitle>
          <DialogDescription>
            {activeTab === 'teachers' ? 'Register a new staff member in the system' : 'Admit a new student to the school'}
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
            schools={schools}
            grades={grades}
            userRole={user?.role}
            userSchoolId={user?.schoolId}
          />
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={activeTab === 'teachers' ? handleAddTeacher : handleAddStudent}>
            {activeTab === 'teachers' ? 'Add Staff' : 'Admit Student'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
