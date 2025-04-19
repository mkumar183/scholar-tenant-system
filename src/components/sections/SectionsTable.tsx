import { useState, useEffect } from 'react';
import { Section } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnrollStudentsDialog } from './EnrollStudentsDialog';

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
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  useEffect(() => {
    console.log('SectionsTable - gradeId:', gradeId);
  }, [gradeId]);

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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section) => (
            <TableRow key={section.id}>
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
                  <span className={section.is_active ? "text-green-600" : "text-red-600"}>
                    {section.is_active ? 
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Active
                      </div> : 
                      <div className="flex items-center">
                        <X className="h-4 w-4 mr-1" />
                        Inactive
                      </div>
                    }
                  </span>
                </div>
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
          ))}
          {sections.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6">
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
