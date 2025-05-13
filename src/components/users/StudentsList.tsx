import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, School, GraduationCap, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import EmptyState from './EmptyState';
import { format } from 'date-fns';
import { Student } from "@/types";
import { Button } from "@/components/ui/button";

interface StudentsListProps {
  students: Student[];
  onEdit: (student: Student) => void;
}

const StudentsList = ({ students, onEdit }: StudentsListProps) => {
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
            <TableHead>School</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Admission Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.schoolName}</TableCell>
              <TableCell>{student.grade}</TableCell>
              <TableCell>{student.sectionName || 'Not enrolled'}</TableCell>
              <TableCell>
                <Badge variant={student.admissionStatus === 'pending' ? 'destructive' : 'default'}>
                  {student.admissionStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(student)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentsList;
