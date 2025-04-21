import React from 'react';
import { Section } from '@/types';
import SectionsManager from '@/components/sections/SectionsManager';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const { enrollStudents } = useEnrollments(selectedGradeId || '', user?.id || '');

  const handleEnrollStudents = async (sectionId: string, studentIds: string[]) => {
    console.log('GradeSectionsArea - Enrolling students:', {
      sectionId,
      studentIds,
      selectedGradeId
    });
    await enrollStudents(studentIds, sectionId);
  };

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
      <h3 className="text-lg font-semibold mb-4"></h3>
      
      {sectionsLoading ? (
        <LoadingSpinner message="Loading sections..." />
      ) : (
        <React.Fragment>
          {sections.length > 0 ? (
            <SectionsManager
              sections={sections}
              isLoading={false}
              onAddSection={addSection}
              onUpdateSection={updateSection}
              onToggleStatus={toggleSectionStatus}
              onEnrollStudents={handleEnrollStudents}
              gradeId={selectedGradeId}
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
                onEnrollStudents={handleEnrollStudents}
                gradeId={selectedGradeId}
              />
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default GradeSectionsArea;
