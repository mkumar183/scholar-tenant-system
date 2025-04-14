
import { useState } from 'react';
import { AcademicSession } from '@/types/database.types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Check } from 'lucide-react';
import { AcademicSessionDialog } from './AcademicSessionDialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AcademicSessionsTableProps {
  sessions: AcademicSession[];
  onEdit: (id: string, session: Partial<Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>>) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

export function AcademicSessionsTable({ 
  sessions, 
  onEdit, 
  onDelete,
  onSetActive 
}: AcademicSessionsTableProps) {
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditClick = (session: AcademicSession) => {
    setEditingSession(session);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = (updatedSession: Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingSession) {
      onEdit(editingSession.id, updatedSession);
      setIsEditDialogOpen(false);
      setEditingSession(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSessionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (sessionToDelete) {
      onDelete(sessionToDelete);
      setIsDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No academic sessions found. Create one to get started.
              </TableCell>
            </TableRow>
          )}
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell className="font-medium">{session.name}</TableCell>
              <TableCell>{format(new Date(session.start_date), 'PP')}</TableCell>
              <TableCell>{format(new Date(session.end_date), 'PP')}</TableCell>
              <TableCell>
                {session.is_active ? (
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                ) : (
                  <Badge variant="outline">Inactive</Badge>
                )}
              </TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                {!session.is_active && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onSetActive(session.id)}
                    title="Set as active"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleEditClick(session)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDeleteClick(session.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingSession && (
        <AcademicSessionDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingSession(null);
          }}
          onSave={handleEditSave}
          session={editingSession}
          isEditing={true}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this academic session. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
