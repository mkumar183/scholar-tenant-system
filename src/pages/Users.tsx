
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import SearchBar from '@/components/users/SearchBar';
import AddUserDialog from '@/components/users/AddUserDialog';
import TeachersList from '@/components/users/TeachersList';
import StudentsList from '@/components/users/StudentsList';

// Import mock data for subjects and grades
import { SUBJECTS, GRADES } from '@/components/users/usersData';

// Import custom hooks
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';
import { useSchools } from '@/hooks/useSchools';

const Users = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    schoolId: '',
    subjects: [''],
  });
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    schoolId: '',
    grade: '',
    guardianName: '',
  });

  const { teachers, isLoading: teachersLoading, addTeacher } = useTeachers();
  const { students, isLoading: studentsLoading, addStudent } = useStudents();
  const { schools, isLoading: schoolsLoading } = useSchools();

  // Filter data based on search
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = async () => {
    const success = await addTeacher(newTeacher);
    if (success) {
      setNewTeacher({
        name: '',
        email: '',
        phone: '',
        schoolId: '',
        subjects: [''],
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleAddStudent = async () => {
    const success = await addStudent(newStudent);
    if (success) {
      setNewStudent({
        name: '',
        email: '',
        phone: '',
        schoolId: '',
        grade: '',
        guardianName: '',
      });
      setIsAddDialogOpen(false);
    }
  };

  const isLoading = teachersLoading || studentsLoading || schoolsLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <AddUserDialog
          activeTab={activeTab}
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          newTeacher={newTeacher}
          setNewTeacher={setNewTeacher}
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          handleAddTeacher={handleAddTeacher}
          handleAddStudent={handleAddStudent}
          schools={schools}
          subjects={SUBJECTS}
          grades={GRADES}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <TabsContent value="teachers">
              <TeachersList teachers={filteredTeachers} />
            </TabsContent>
            
            <TabsContent value="students">
              <StudentsList students={filteredStudents} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Users;
