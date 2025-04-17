
import { useState, useEffect } from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => Promise<boolean>;
  editingSection: Section | null;
}

const SectionDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  editingSection,
}: SectionDialogProps) => {
  const [sectionName, setSectionName] = useState('');

  useEffect(() => {
    if (editingSection) {
      setSectionName(editingSection.name);
    } else {
      setSectionName('');
    }
  }, [editingSection, isOpen]);

  const handleSubmit = async () => {
    if (!sectionName.trim()) return;
    const success = await onSubmit(sectionName);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Enter section name (e.g., A, B, C)"
            />
          </div>
          <Button onClick={handleSubmit}>
            {editingSection ? 'Update Section' : 'Add Section'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectionDialog;
