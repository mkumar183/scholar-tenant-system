
import { useState } from 'react';
import { StudentAdmission } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AdmitStudentDialog from './AdmitStudentDialog';
import { useGrades } from '@/hooks/useGrades';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X } from 'lucide-react';

interface AdmissionsListProps {
  admissions: StudentAdmission[];
  isLoading: boolean;
  students: any[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => Promise<boolean>;
  onAdmitStudent: (values: any) => Promise<boolean>;
  schoolId: string;
}

const AdmissionsList = ({
  admissions,
  isLoading,
  students,
  onUpdateStatus,
  onAdmitStudent,
  schoolId
}: AdmissionsListProps) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    admissionId: string;
    action: 'approve' | 'reject';
  }>({
    isOpen: false,
    admissionId: '',
    action: 'approve'
  });
  
  const { grades } = useGrades();
  const { user } = useAuth();
  
  // Only school admins can admit students and update admission status
  const isSchoolAdmin = user?.role === 'school_admin';

  const handleStatusUpdate = async () => {
    const status = confirmDialog.action === 'approve' ? 'approved' : 'rejected';
    const success = await onUpdateStatus(confirmDialog.admissionId, status);
    if (success) {
      setConfirmDialog({ isOpen: false, admissionId: '', action: 'approve' });
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isSchoolAdmin && (
        <div className="flex justify-end">
          <AdmitStudentDialog
            students={students.filter(s => !s.schoolId)}
            grades={grades || []}
            schoolId={schoolId}
            onSubmit={onAdmitStudent}
          />
        </div>
      )}

      {admissions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No admissions found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
              {isSchoolAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {admissions.map((admission) => {
              const student = students.find(s => s.id === admission.student_id);
              const grade = grades?.find(g => g.id === admission.grade_id);
              
              return (
                <TableRow key={admission.id}>
                  <TableCell>{student?.name || 'Unknown'}</TableCell>
                  <TableCell>{grade?.name || 'Unknown'}</TableCell>
                  <TableCell>{new Date(admission.admission_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(admission.status)}>
                      {admission.status.charAt(0).toUpperCase() + admission.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{admission.remarks || '-'}</TableCell>
                  {isSchoolAdmin && (
                    <TableCell className="text-right">
                      {admission.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => setConfirmDialog({
                              isOpen: true,
                              admissionId: admission.id,
                              action: 'approve'
                            })}
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 border-red-200 hover:bg-red-100 hover:text-red-600"
                            onClick={() => setConfirmDialog({
                              isOpen: true,
                              admissionId: admission.id,
                              action: 'reject'
                            })}
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === 'approve' ? 'Approve Admission' : 'Reject Admission'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.action} this student admission?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'approve' ? 'default' : 'destructive'}
              onClick={handleStatusUpdate}
            >
              {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdmissionsList;
