
import { useState, useEffect } from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';

interface SectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => Promise<boolean>;
  editingSection: Section | null;
}

const commonSectionNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const SectionDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  editingSection,
}: SectionDialogProps) => {
  const [sectionName, setSectionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSection) {
      setSectionName(editingSection.name);
    } else {
      setSectionName('');
    }
  }, [editingSection, isOpen]);

  const handleSubmit = async () => {
    if (!sectionName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const success = await onSubmit(sectionName);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingSection ? 'Edit Section' : 'Add New Section'}
          </DialogTitle>
          <DialogDescription>
            {editingSection 
              ? 'Update the section details below.' 
              : 'Sections help organize students within the same grade (e.g., "A", "B", "C").'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <FormLabel>Section Name</FormLabel>
            <Input
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Enter section name (e.g., A, B, C)"
              disabled={isSubmitting}
              autoFocus
              className="mt-1.5"
            />
            <p className="text-sm text-muted-foreground mt-1.5">
              Typically sections are named with single letters or numbers.
            </p>
          </div>
          
          {!editingSection && (
            <div className="grid grid-cols-5 gap-2">
              {commonSectionNames.map(name => (
                <Button 
                  key={name}
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSectionName(name)}
                >
                  {name}
                </Button>
              ))}
            </div>
          )}
          
          <Button 
            onClick={handleSubmit} 
            disabled={!sectionName.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting 
              ? 'Processing...' 
              : editingSection 
                ? 'Update Section' 
                : 'Add Section'
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectionDialog;
