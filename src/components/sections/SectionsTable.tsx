
import { Section } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface SectionsTableProps {
  sections: Section[];
  onEdit: (section: Section) => void;
  onToggleStatus: (id: string, isActive: boolean) => Promise<boolean>;
}

const SectionsTable = ({ sections, onEdit, onToggleStatus }: SectionsTableProps) => {
  return (
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
            <TableCell>{section.name}</TableCell>
            <TableCell>
              <Switch
                checked={section.is_active}
                onCheckedChange={(checked) => onToggleStatus(section.id, checked)}
              />
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(section)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {sections.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              No sections found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SectionsTable;
