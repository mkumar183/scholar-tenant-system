import { useState } from 'react';
import { Section } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Pencil, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnrollStudentsDialog } from './EnrollStudentsDialog';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';
import EnrolledStudentsButton from './EnrolledStudentsButton';
import EnrolledStudentsList from './EnrolledStudentsList';

interface SectionsTableProps {
  sections: Section[];
  onEdit: (section: Section) => void;
  onToggleStatus: (id: string, isActive: boolean) => Promise<boolean>;
  onEnrollStudents: (sectionId: string, studentIds: string[]) => Promise<void>;
  gradeId: string;
}

const SectionsTable = ({ 
  sections, 
  onEdit, 
  onToggleStatus,
  onEnrollStudents,
  gradeId,
}: SectionsTableProps) => {
  const { user } = useAuth();
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  
  const { enrollments, isLoading, fetchEnrollments } = useEnrollments(openSectionId || '', user?.id || '');

  return (
    <div className="border rounded-md">
      <EnrollStudentsDialog
        isOpen={!!selectedSectionId}
        onClose={() => setSelectedSectionId(null)}
        sectionId={selectedSectionId || ''}
        gradeId={gradeId}
        onEnroll={async (studentIds) => {
          if (selectedSectionId) {
            await onEnrollStudents(selectedSectionId, studentIds);
          }
        }}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Enrolled Students</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section) => (
            <Collapsible key={section.id}>
              <TableRow>
                <TableCell>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 font-bold">
                      {section.name}
                    </Badge>
                    <span>Section {section.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={section.is_active}
                      onCheckedChange={(checked) => onToggleStatus(section.id, checked)}
                    />
                    <span>{section.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <EnrolledStudentsButton
                    count={enrollments?.length || 0}
                    isOpen={openSectionId === section.id}
                    onClick={() => {
                      if (openSectionId === section.id) {
                        setOpenSectionId(null);
                      } else {
                        setOpenSectionId(section.id);
                        fetchEnrollments();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(section)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSectionId(section.id)}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Enroll Students
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <CollapsibleContent>
                {openSectionId === section.id && (
                  <EnrolledStudentsList 
                    enrollments={enrollments} 
                    isLoading={isLoading} 
                  />
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
          {sections.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                <div className="text-muted-foreground space-y-1">
                  <p>No sections found</p>
                  <p className="text-sm">Add a section using the button above</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SectionsTable;
