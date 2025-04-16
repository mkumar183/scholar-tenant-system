import EmptyState from './EmptyState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, School, BookOpen, User } from 'lucide-react';

interface TeachersListProps {
  teachers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    schoolId: string;
    schoolName: string;
  }[];
}

const TeachersList = ({ teachers }: TeachersListProps) => {
  if (teachers.length === 0) {
    return <EmptyState type="teachers" />;
  }
  
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'school_admin':
        return 'School Admin';
      case 'teacher':
        return 'Teacher';
      case 'staff':
        return 'Staff';
      default:
        return role;
    }
  };
  
  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>School</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell className="font-medium">{teacher.name}</TableCell>
              <TableCell className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                {teacher.email}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  {getRoleDisplay(teacher.role)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <School className="mr-2 h-4 w-4 text-muted-foreground" />
                  {teacher.schoolName}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeachersList;
