import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, School, GraduationCap, User } from 'lucide-react';
import EmptyState from './EmptyState';

interface StudentsListProps {
  students: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    schoolId: string;
    schoolName: string;
    grade: string;
    guardianName: string;
  }[];
}

const StudentsList = ({ students }: StudentsListProps) => {
  if (students.length === 0) {
    return <EmptyState type="students" />;
  }
  
  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Guardian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                {student.email}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                  {student.grade}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <School className="mr-2 h-4 w-4 text-muted-foreground" />
                  {student.schoolName}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  {student.guardianName}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentsList;
