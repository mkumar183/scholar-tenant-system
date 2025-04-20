
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Section } from '@/types';
import { Pencil, PlusCircle, Users } from 'lucide-react';
import SectionDialog from './SectionDialog';
import EnrollStudentsDialog from './EnrollStudentsDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useEnrollments } from '@/hooks/useEnrollments';
import EnrolledStudentsButton from './EnrolledStudentsButton';
import EnrolledStudentsList from './EnrolledStudentsList';

interface SectionsTableProps {
  sections: Section[];
  onSectionAdded: () => void;
  onSectionUpdated: () => void;
  gradeId: string;
  academicSessionId: string;
  schoolId: string;
}

const SectionsTable: React.FC<SectionsTableProps> = ({
  sections,
  onSectionAdded,
  onSectionUpdated,
  gradeId,
  academicSessionId,
  schoolId,
}) => {
  const { user } = useAuth();
  const { refreshEnrollments } = useEnrollments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [enrollingSectionId, setEnrollingSectionId] = useState<string>('');
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  const handleAddSection = () => {
    setEditingSection(null);
    setIsDialogOpen(true);
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setIsDialogOpen(true);
  };

  const handleOpenEnrollDialog = (sectionId: string) => {
    setEnrollingSectionId(sectionId);
    setIsEnrollDialogOpen(true);
  };

  const handleEnrollSuccess = () => {
    refreshEnrollments();
  };

  const toggleExpandSection = (sectionId: string) => {
    setExpandedSectionId(expandedSectionId === sectionId ? null : sectionId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Sections</h3>
        <Button onClick={handleAddSection}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Enrolled Students</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No sections found. Click "Add Section" to create your first section.
              </TableCell>
            </TableRow>
          ) : (
            sections.map((section) => (
              <>
                <TableRow key={section.id}>
                  <TableCell className="font-medium">{section.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      section.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {section.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <EnrolledStudentsButton 
                      sectionId={section.id}
                      onClick={() => toggleExpandSection(section.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSection(section)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEnrollDialog(section.id)}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Enroll
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedSectionId === section.id && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <div className="bg-muted/30 p-4">
                        <EnrolledStudentsList sectionId={section.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          )}
        </TableBody>
      </Table>

      <SectionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialSection={editingSection}
        onSubmit={onSectionUpdated}
        gradeId={gradeId}
        academicSessionId={academicSessionId}
        schoolId={schoolId}
      />

      {isEnrollDialogOpen && (
        <EnrollStudentsDialog
          isOpen={isEnrollDialogOpen}
          onOpenChange={setIsEnrollDialogOpen}
          sectionId={enrollingSectionId}
          gradeId={gradeId}
          academicSessionId={academicSessionId}
          onSuccess={handleEnrollSuccess}
        />
      )}
    </div>
  );
};

export default SectionsTable;
