import { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Check, Star, CalendarRange, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AcademicSessionDialog } from './AcademicSessionDialog';
import { AcademicSession } from '@/types/database.types';
import { Badge } from '@/components/ui/badge';

interface AcademicSessionsTableProps {
  sessions: AcademicSession[];
  onEdit: (id: string, updates: Partial<Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>>) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
  onSelect?: (id: string) => void;
}

export function AcademicSessionsTable({ 
  sessions, 
  onEdit, 
  onDelete, 
  onSetActive,
  onSelect 
}: AcademicSessionsTableProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AcademicSession | null>(null);

  const handleEdit = (session: AcademicSession) => {
    setSelectedSession(session);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (session: AcademicSession) => {
    setSelectedSession(session);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSession) {
      onDelete(selectedSession.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveEdit = (updates: Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedSession) {
      onEdit(selectedSession.id, updates);
      setIsEditDialogOpen(false);
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
          {sessions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No academic sessions found
              </TableCell>
            </TableRow>
          ) : (
            sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.name}</TableCell>
                <TableCell>{format(new Date(session.start_date), 'PP')}</TableCell>
                <TableCell>{format(new Date(session.end_date), 'PP')}</TableCell>
                <TableCell>
                  <Badge variant={session.is_active ? "default" : "secondary"}>
                    {session.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  {onSelect && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onSelect(session.id)} 
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(session)} 
                    title="Edit Session"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(session)} 
                    title="Delete Session"
                  >
                    <Trash2 size={16} />
                  </Button>
                  {!session.is_active && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onSetActive(session.id)} 
                      title="Set as Active"
                    >
                      <Star size={16} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      {selectedSession && (
        <AcademicSessionDialog 
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveEdit}
          session={selectedSession}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Academic Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this academic session?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
