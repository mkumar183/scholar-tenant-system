
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Enrollment } from '@/hooks/useEnrollments';
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface EnrolledStudentsListProps {
  enrollments: Enrollment[];
  isLoading: boolean;
}

const EnrolledStudentsList = ({ enrollments, isLoading }: EnrolledStudentsListProps) => {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => (
            <TableRow key={enrollment.id}>
              <TableCell>{enrollment.student_id}</TableCell>
              <TableCell>
                {format(new Date(enrollment.enrolled_at), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <EnrollmentStatusBadge status={enrollment.status} />
              </TableCell>
            </TableRow>
          ))}
          {enrollments.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
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
