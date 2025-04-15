
import { useState } from 'react';
import { SUBJECTS, GRADES } from '@/components/users/usersData';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';
import { useSchools } from '@/hooks/useSchools';
import { useUserSearch } from '@/hooks/useUserSearch';
import UserManagementHeader from '@/components/users/UserManagementHeader';
import UserTabs from '@/components/users/UserTabs';

const Users = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    schoolId: '',
    subjects: [''],
    password: '',
    role: 'teacher',
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

  const { searchTerm, setSearchTerm, filteredUsers: filteredTeachers } = useUserSearch(teachers);
  const { filteredUsers: filteredStudents } = useUserSearch(students);

  const handleAddTeacher = async () => {
    const success = await addTeacher(newTeacher);
    if (success) {
      setNewTeacher({
        name: '',
        email: '',
        phone: '',
        schoolId: '',
        subjects: [''],
        password: '',
        role: 'teacher',
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
      <UserManagementHeader
        activeTab={activeTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
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
      
      <UserTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredTeachers={filteredTeachers}
        filteredStudents={filteredStudents}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Users;
