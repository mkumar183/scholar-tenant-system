
import React from 'react';
import { Section } from '@/types';
import SectionsManager from '@/components/sections/SectionsManager';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface GradeSectionsAreaProps {
  selectedGradeId: string | null;
  canManageSections: boolean;
  sectionsLoading: boolean;
  sections: Section[];
  addSection: (name: string) => Promise<boolean>;
  updateSection: (id: string, name: string) => Promise<boolean>;
  toggleSectionStatus: (id: string, isActive: boolean) => Promise<boolean>;
}

const GradeSectionsArea = ({
  selectedGradeId,
  canManageSections,
  sectionsLoading,
  sections,
  addSection,
  updateSection,
  toggleSectionStatus,
}: GradeSectionsAreaProps) => {
  if (!selectedGradeId) {
    return (
      <div className="text-center text-muted-foreground p-4 bg-background border rounded">
        <p>Select a grade to view and manage its sections</p>
      </div>
    );
  }

  if (!canManageSections) {
    return (
      <div className="mt-8 p-4 border rounded-md">
        <p className="text-muted-foreground text-center">
          Only school administrators can manage sections. Tenant administrators cannot manage sections directly.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Sections for Selected Grade</h3>
      
      {sectionsLoading ? (
        <div className="p-8 border border-dashed rounded-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2 mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading sections data...</p>
        </div>
      ) : (
        <React.Fragment>
          {sections.length > 0 ? (
            <SectionsManager
              sections={sections}
              isLoading={false}
              onAddSection={addSection}
              onUpdateSection={updateSection}
              onToggleStatus={toggleSectionStatus}
            />
          ) : (
            <div className="p-4 border rounded-md text-center">
              <p className="text-muted-foreground">No sections found for this grade</p>
              <SectionsManager
                sections={[]}
                isLoading={false}
                onAddSection={addSection}
                onUpdateSection={updateSection}
                onToggleStatus={toggleSectionStatus}
              />
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default GradeSectionsArea;
