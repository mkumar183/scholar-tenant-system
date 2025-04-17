
import { useState, useEffect } from 'react';
import { Section } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    console.log("SectionsManager props changed:", { 
      sections: sections?.length || 0, 
      isLoading 
    });
  }, [sections, isLoading]);

  const handleSubmit = async (name: string) => {
    setIsSubmitting(true);
    try {
      if (editingSection) {
        return await onUpdateSection(editingSection.id, name);
      }
      return await onAddSection(name);
    } finally {
      setIsSubmitting(false);
    }
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
    return <SectionsLoading />;
  }

  const quickSectionButtons = ['A', 'B', 'C', 'D'];
  const existingSectionNames = sections.map(s => s.name);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sections</h3>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {/* Quick section buttons */}
      <div className="flex flex-wrap gap-2 mt-2">
        {quickSectionButtons.map((sectionName) => (
          <Button
            key={sectionName}
            variant="outline"
            size="sm"
            className={existingSectionNames.includes(sectionName) ? "opacity-50 cursor-not-allowed" : ""}
            disabled={existingSectionNames.includes(sectionName) || isSubmitting}
            onClick={async () => {
              if (!existingSectionNames.includes(sectionName)) {
                setIsSubmitting(true);
                try {
                  await onAddSection(sectionName);
                } finally {
                  setIsSubmitting(false);
                }
              }
            }}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-1" />}
            Section {sectionName}
          </Button>
        ))}
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
