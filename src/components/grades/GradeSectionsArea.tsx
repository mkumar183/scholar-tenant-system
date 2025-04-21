
import React from 'react';
import { Section } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';
import GradeSectionsContent from './GradeSectionsContent';

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
    <div className="mt-4">
      <GradeSectionsContent
        sections={sections}
        sectionsLoading={sectionsLoading}
        addSection={addSection}
        updateSection={updateSection}
        toggleSectionStatus={toggleSectionStatus}
        onEnrollStudents={handleEnrollStudents}
        gradeId={selectedGradeId}
      />
    </div>
  );
};

export default GradeSectionsArea;
