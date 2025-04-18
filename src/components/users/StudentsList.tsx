
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, School, GraduationCap, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import EmptyState from './EmptyState';
import { format } from 'date-fns';
import { Student } from "@/types";

interface StudentsListProps {
  students: Student[];
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
            <TableHead>Date of Birth</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Guardian</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {student.dateOfBirth ? format(new Date(student.dateOfBirth), 'MMM d, yyyy') : 'Not provided'}
                </div>
              </TableCell>
              <TableCell className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                {student.email}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                  {student.grade || 'Not assigned'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <School className="mr-2 h-4 w-4 text-muted-foreground" />
                  {student.schoolName || 'Not assigned'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  {student.guardianName}
                </div>
              </TableCell>
              <TableCell>
                {student.admissionStatus ? (
                  <Badge variant={student.admissionStatus === 'active' ? 'success' : 
                          student.admissionStatus === 'pending' ? 'warning' : 'error'}>
                    {student.admissionStatus === 'active' ? (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    ) : (
                      <XCircle className="mr-1 h-3 w-3" />
                    )}
                    {student.admissionStatus.charAt(0).toUpperCase() + student.admissionStatus.slice(1)}
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not admitted</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentsList;
