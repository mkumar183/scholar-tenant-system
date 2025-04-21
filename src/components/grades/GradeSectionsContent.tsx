
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Section } from '@/types';
import SectionsManager from '@/components/sections/SectionsManager';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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
  if (sectionsLoading) {
    return <LoadingSpinner message="Loading sections..." />;
  }

  return (
    <div className="w-full p-4">
      <SectionsManager
        sections={sections}
        isLoading={false}
        onAddSection={addSection}
        onUpdateSection={updateSection}
        onToggleStatus={toggleSectionStatus}
        onEnrollStudents={onEnrollStudents}
        gradeId={gradeId}
      />
    </div>
  );
};

export default GradeSectionsContent;
