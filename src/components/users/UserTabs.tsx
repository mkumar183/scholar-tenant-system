
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeachersList from './TeachersList';
import StudentsList from './StudentsList';

interface UserTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  filteredTeachers: any[];
  filteredStudents: any[];
  isLoading: boolean;
}

const UserTabs = ({ 
  activeTab, 
  setActiveTab, 
  filteredTeachers, 
  filteredStudents, 
  isLoading 
}: UserTabsProps) => {
  return (
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
            <StudentsList students={filteredStudents} />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

export default UserTabs;
