
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GRADES } from '@/components/users/usersData';
import { Teacher, Student, School } from '@/types';

// Import components
import SearchBar from '@/components/users/SearchBar';
import AddUserDialog from '@/components/users/AddUserDialog';
import TeachersList from '@/components/users/TeachersList';
import StudentsList from '@/components/users/StudentsList';

// Import hooks
import { useUserManagement } from '@/hooks/useUserManagement';
import { useUserData } from '@/hooks/useUserData';
import { useUserSearch } from '@/hooks/useUserSearch';

const Users = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const {
    teachers,
    setTeachers,
    students,
    setStudents,
    schools,
    setSchools,
    isLoading,
    setIsLoading,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newTeacher,
    setNewTeacher,
    newStudent,
    setNewStudent,
    handleAddTeacher,
    handleAddStudent,
  } = useUserManagement();

  // Initialize data fetching - pass each function separately
  useUserData(setTeachers, setStudents, setSchools, setIsLoading);

  // Handle search
  const { filteredTeachers, filteredStudents } = useUserSearch(searchTerm, teachers, students);

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
          grades={GRADES}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="teachers">Staff</TabsTrigger>
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
              <StudentsList students={filteredStudents as any} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Users;
