
import { useState } from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Pencil, Plus } from 'lucide-react';

interface SectionsManagerProps {
  sections: Section[];
  isLoading: boolean;
  onAddSection: (name: string) => Promise<boolean>;
  onUpdateSection: (id: string, name: string) => Promise<boolean>;
  onToggleStatus: (id: string, isActive: boolean) => Promise<boolean>;
}

export const SectionsManager = ({
  sections,
  isLoading,
  onAddSection,
  onUpdateSection,
  onToggleStatus,
}: SectionsManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [newSectionName, setNewSectionName] = useState('');

  const handleSubmit = async () => {
    if (!newSectionName.trim()) return;

    const success = editingSection
      ? await onUpdateSection(editingSection.id, newSectionName)
      : await onAddSection(newSectionName);

    if (success) {
      setIsDialogOpen(false);
      setNewSectionName('');
      setEditingSection(null);
    }
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setNewSectionName(section.name);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sections</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingSection(null);
                setNewSectionName('');
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSection ? 'Edit Section' : 'Add New Section'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Section Name</label>
                <Input
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Enter section name (e.g., A, B, C)"
                />
              </div>
              <Button onClick={handleSubmit}>
                {editingSection ? 'Update Section' : 'Add Section'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                  onClick={() => handleEdit(section)}
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
    </div>
  );
};
