
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Import components
import SearchBar from '@/components/users/SearchBar';
import AddUserDialog from '@/components/users/AddUserDialog';
import TeachersList from '@/components/users/TeachersList';
import StudentsList from '@/components/users/StudentsList';

// Import mock data
import { 
  MOCK_TEACHERS, 
  MOCK_STUDENTS, 
  MOCK_SCHOOLS, 
  SUBJECTS, 
  GRADES 
} from '@/components/users/usersData';

const Users = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [students, setStudents] = useState(MOCK_STUDENTS);
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

  // Add new teacher
  const handleAddTeacher = () => {
    const id = `teacher-${teachers.length + 1}`;
    const schoolName = MOCK_SCHOOLS.find(s => s.id === newTeacher.schoolId)?.name || '';
    
    const newTeacherData = {
      ...newTeacher,
      id,
      role: 'teacher',
      schoolName,
      subjects: [newTeacher.subjects[0]],
    };
    
    setTeachers([...teachers, newTeacherData]);
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      schoolId: '',
      subjects: [''],
    });
    setIsAddDialogOpen(false);
    toast.success('Teacher added successfully');
  };

  // Add new student
  const handleAddStudent = () => {
    const id = `student-${students.length + 1}`;
    const schoolName = MOCK_SCHOOLS.find(s => s.id === newStudent.schoolId)?.name || '';
    
    const newStudentData = {
      ...newStudent,
      id,
      role: 'student',
      schoolName,
    };
    
    setStudents([...students, newStudentData]);
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      schoolId: '',
      grade: '',
      guardianName: '',
    });
    setIsAddDialogOpen(false);
    toast.success('Student added successfully');
  };

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
          schools={MOCK_SCHOOLS}
          subjects={SUBJECTS}
          grades={GRADES}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teachers">
          <TeachersList teachers={filteredTeachers} />
        </TabsContent>
        
        <TabsContent value="students">
          <StudentsList students={filteredStudents} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;
