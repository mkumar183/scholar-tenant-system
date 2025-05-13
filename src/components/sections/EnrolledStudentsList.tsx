import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Enrollment } from '@/hooks/useEnrollments';
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';

interface EnrolledStudentsListProps {
  enrollments: Enrollment[];
  isLoading: boolean;
  sectionId: string;
}

const EnrolledStudentsList = ({ enrollments, isLoading, sectionId }: EnrolledStudentsListProps) => {
  const { user } = useAuth();
  const { updateEnrollmentStatus, fetchEnrollments } = useEnrollments(sectionId, user?.id || '');

  const handleEdit = async (enrollment: Enrollment) => {
    // TODO: Implement edit functionality
    console.log('Editing enrollment:', enrollment);
  };

  const handleDelete = async (enrollment: Enrollment) => {
    try {
      await updateEnrollmentStatus(enrollment.id, 'withdrawn');
      // Refresh enrollments after successful deletion
      await fetchEnrollments();
    } catch (error) {
      console.error('Error withdrawing student:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading enrolled students..." />;
  }

  return (
    <div className="p-4 bg-muted/50 rounded-md mt-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Enrolled On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => (
            <TableRow key={enrollment.id}>
              <TableCell>{enrollment.student_name || 'Unknown Student'}</TableCell>
              <TableCell>
                {format(new Date(enrollment.enrolled_at), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <EnrollmentStatusBadge status={enrollment.status} />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(enrollment)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(enrollment)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {enrollments.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No students enrolled
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EnrolledStudentsList;
