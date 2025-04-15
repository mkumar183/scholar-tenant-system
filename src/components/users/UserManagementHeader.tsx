
import SearchBar from './SearchBar';
import AddUserDialog from './AddUserDialog';

interface UserManagementHeaderProps {
  activeTab: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (value: boolean) => void;
  newTeacher: any;
  setNewTeacher: (value: any) => void;
  newStudent: any;
  setNewStudent: (value: any) => void;
  handleAddTeacher: () => void;
  handleAddStudent: () => void;
  schools: any[];
  subjects: string[];
  grades: string[];
}

const UserManagementHeader = ({
  activeTab,
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
  schools,
  subjects,
  grades
}: UserManagementHeaderProps) => {
  return (
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
        subjects={subjects}
        grades={grades}
      />
    </div>
  );
};

export default UserManagementHeader;
