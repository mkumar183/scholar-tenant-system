
import { useState } from 'react';
import { FeeAssignment } from '../../mock/feeAssignments';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useFeeManagement } from '../../contexts/FeeManagementContext';
import FeeAssignmentDialog from './FeeAssignmentDialog';
import { Badge } from '@/components/ui/badge';

const FeeAssignmentsTable = () => {
  const { feeAssignments, feeGroups, deleteFeeAssignment } = useFeeManagement();
  const [editingAssignment, setEditingAssignment] = useState<FeeAssignment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<FeeAssignment | null>(null);

  const handleEdit = (assignment: FeeAssignment) => {
    setEditingAssignment(assignment);
    setIsDialogOpen(true);
  };

  const handleDelete = (assignment: FeeAssignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (assignmentToDelete) {
      deleteFeeAssignment(assignmentToDelete.id);
      toast.success('Fee assignment deleted successfully');
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    }
  };

  const getFeeGroupName = (groupId: string) => {
    return feeGroups.find(group => group.id === groupId)?.name || 'Unknown Group';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Fee Assignments</h2>
        <Button onClick={() => {
          setEditingAssignment(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Fee
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fee Group</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Stream</TableHead>
            <TableHead>Academic Session</TableHead>
            <TableHead>Term</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeAssignments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No fee assignments found. Create your first assignment to get started.
              </TableCell>
            </TableRow>
          ) : (
            feeAssignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">{getFeeGroupName(assignment.feeGroupId)}</TableCell>
                <TableCell>{assignment.gradeName}</TableCell>
                <TableCell>
                  {assignment.streamName || <Badge variant="outline">All Streams</Badge>}
                </TableCell>
                <TableCell>{assignment.academicSessionName}</TableCell>
                <TableCell>
                  {assignment.termName || <Badge variant="outline">All Terms</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(assignment)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(assignment)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <FeeAssignmentDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialAssignment={editingAssignment}
        isEditMode={!!editingAssignment}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this fee assignment. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FeeAssignmentsTable;
