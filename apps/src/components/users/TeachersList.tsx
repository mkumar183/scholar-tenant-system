import EmptyState from './EmptyState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, School, BookOpen } from 'lucide-react';

interface TeachersListProps {
  teachers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    schoolId: string;
    schoolName: string;
    subjects: string[];
  }[];
}

const TeachersList = ({ teachers }: TeachersListProps) => {
  if (teachers.length === 0) {
    return <EmptyState type="teachers" />;
  }
  
  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Subjects</TableHead>
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
                  <School className="mr-2 h-4 w-4 text-muted-foreground" />
                  {teacher.schoolName}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects.map((subject) => (
                    <span 
                      key={subject} 
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center"
                    >
                      <BookOpen className="mr-1 h-3 w-3" />
                      {subject}
                    </span>
                  ))}
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
