import { useState, useEffect } from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SectionDialog from './SectionDialog';
import SectionsTable from './SectionsTable';
import SectionsLoading from './SectionsLoading';

interface SectionsManagerProps {
  sections: Section[];
  isLoading: boolean;
  onAddSection: (name: string) => Promise<boolean>;
  onUpdateSection: (id: string, name: string) => Promise<boolean>;
  onToggleStatus: (id: string, isActive: boolean) => Promise<boolean>;
}

const SectionsManager = ({
  sections,
  isLoading,
  onAddSection,
  onUpdateSection,
  onToggleStatus,
}: SectionsManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  
  console.log("SectionsManager rendering with props:", { 
    sections: sections?.length || 0, 
    isLoading 
  });
  
  useEffect(() => {
    console.log("SectionsManager props changed:", { 
      sections: sections?.length || 0, 
      isLoading 
    });
  }, [sections, isLoading]);

  const handleSubmit = async (name: string) => {
    if (editingSection) {
      return await onUpdateSection(editingSection.id, name);
    }
    return await onAddSection(name);
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingSection(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    console.log("SectionsManager showing loading spinner");
    return <SectionsLoading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sections</h3>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      <SectionDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        editingSection={editingSection}
      />

      <SectionsTable 
        sections={sections}
        onEdit={handleEdit}
        onToggleStatus={onToggleStatus}
      />
    </div>
  );
};

export default SectionsManager;
