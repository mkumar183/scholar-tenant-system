
import React, { useState } from 'react';
import { Section } from '@/types';
import SectionDialog from '@/components/sections/SectionDialog';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card } from '@/components/ui/card';
import VerticalSectionsTabs from '../sections/VerticalSectionsTabs';
import SectionDetails from '../sections/SectionDetails';
import EnrolledStudentsList from '../sections/EnrolledStudentsList';
import { EnrollStudentsDialog } from '../sections/EnrollStudentsDialog';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';

interface GradeSectionsContentProps {
  sections: Section[];
  sectionsLoading: boolean;
  addSection: (name: string) => Promise<boolean>;
  updateSection: (id: string, name: string) => Promise<boolean>;
  toggleSectionStatus: (id: string, isActive: boolean) => Promise<boolean>;
  onEnrollStudents: (sectionId: string, studentIds: string[]) => Promise<void>;
  gradeId: string;
}

const GradeSectionsContent = ({
  sections,
  sectionsLoading,
  addSection,
  updateSection,
  toggleSectionStatus,
  onEnrollStudents,
  gradeId,
}: GradeSectionsContentProps) => {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const { enrollments, isLoading: enrollmentsLoading } = useEnrollments(
    selectedSection?.id || '',
    user?.id || ''
  );

  const handleSectionSelect = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    setSelectedSection(section || null);
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setIsSectionDialogOpen(true);
  };

  if (sectionsLoading) {
    return <LoadingSpinner message="Loading sections..." />;
  }

  return (
    <div className="h-[calc(100vh-16rem)]">
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Left side - Vertical tabs */}
        <div className="col-span-3 h-full overflow-y-auto">
          <VerticalSectionsTabs
            sections={sections}
            activeSection={selectedSection?.id || null}
            onSectionSelect={handleSectionSelect}
          />
        </div>

        {/* Right side - Content area */}
        <div className="col-span-9 h-full">
          <Card className="h-full">
            {selectedSection ? (
              <>
                <SectionDetails
                  section={selectedSection}
                  onEdit={handleEdit}
                  onToggleStatus={toggleSectionStatus}
                  onEnrollClick={() => setIsEnrollDialogOpen(true)}
                />
                <div className="p-4 overflow-y-auto h-[calc(100%-5rem)]">
                  <EnrolledStudentsList
                    enrollments={enrollments}
                    isLoading={enrollmentsLoading}
                    sectionId={selectedSection.id}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a section to view details
              </div>
            )}
          </Card>
        </div>
      </div>

      <SectionDialog
        isOpen={isSectionDialogOpen}
        onOpenChange={setIsSectionDialogOpen}
        onSubmit={async (name) => {
          if (editingSection) {
            return await updateSection(editingSection.id, name);
          }
          return await addSection(name);
        }}
        editingSection={editingSection}
      />

      <EnrollStudentsDialog
        isOpen={isEnrollDialogOpen}
        onClose={() => setIsEnrollDialogOpen(false)}
        sectionId={selectedSection?.id || ''}
        gradeId={gradeId}
        onEnroll={(studentIds) => {
          if (selectedSection) {
            return onEnrollStudents(selectedSection.id, studentIds);
          }
          return Promise.resolve();
        }}
      />
    </div>
  );
};

export default GradeSectionsContent;
