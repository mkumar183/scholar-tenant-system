
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School } from '@/types';

// Import components
import SearchBar from '@/components/users/SearchBar';
import AddUserDialog from '@/components/users/AddUserDialog';
import TeachersList from '@/components/users/TeachersList';
import StudentsList from '@/components/users/StudentsList';
import AdmissionsList from '@/components/admissions/AdmissionsList';

// Import hooks
import { useUserManagement } from '@/hooks/useUserManagement';
import { useUserData } from '@/hooks/useUserData';
import { useUserSearch } from '@/hooks/useUserSearch';
import { useAdmissions } from '@/hooks/useAdmissions';
import { useAuth } from '@/contexts/AuthContext';

const Users = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const { user } = useAuth();
  const isSchoolAdmin = user?.role === 'school_admin';
  const schoolId = user?.schoolId || '';
  
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

  // Initialize data fetching
  useUserData(setTeachers, setStudents, setSchools, setIsLoading);

  // Handle search
  const { filteredTeachers, filteredStudents } = useUserSearch(searchTerm, teachers, students);
  
  // Initialize admissions
  const {
    admissions,
    isLoading: isLoadingAdmissions,
    fetchAdmissions,
    createAdmission,
    updateAdmissionStatus
  } = useAdmissions();
  
  // Fetch admissions when tab changes or on initial load if school admin
  useEffect(() => {
    if (activeTab === 'admissions' || isSchoolAdmin) {
      fetchAdmissions();
    }
  }, [activeTab, isSchoolAdmin, fetchAdmissions]);

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
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${isSchoolAdmin ? 'grid-cols-3' : 'grid-cols-2'} mb-6 max-w-md`}>
          <TabsTrigger value="teachers">Staff</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          {isSchoolAdmin && <TabsTrigger value="admissions">Admissions</TabsTrigger>}
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
            
            {isSchoolAdmin && (
              <TabsContent value="admissions">
                <AdmissionsList 
                  admissions={admissions}
                  isLoading={isLoadingAdmissions}
                  students={students}
                  onUpdateStatus={updateAdmissionStatus}
                  onAdmitStudent={createAdmission}
                  schoolId={schoolId}
                />
              </TabsContent>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Users;
