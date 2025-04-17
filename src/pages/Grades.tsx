
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useGrades } from '@/hooks/useGrades';
import { DialogTrigger } from '@/components/ui/dialog';
import { Grade } from '@/types';
import { useSections } from '@/hooks/useSections';
import SectionsManager from '@/components/sections/SectionsManager';
import GradeDialog from '@/components/grades/GradeDialog';
import GradesTable from '@/components/grades/GradesTable';
import AccessDenied from '@/components/common/AccessDenied';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const GRADE_LEVELS = [
  { name: 'Nursery', level: 0 },
  { name: 'LKG', level: 1 },
  { name: 'UKG', level: 2 },
  { name: '1', level: 3 },
  { name: '2', level: 4 },
  { name: '3', level: 5 },
  { name: '4', level: 6 },
  { name: '5', level: 7 },
  { name: '6', level: 8 },
  { name: '7', level: 9 },
  { name: '8', level: 10 },
  { name: '9', level: 11 },
  { name: '10', level: 12 },
  { name: '11', level: 13 },
  { name: '12', level: 14 },
];

const Grades = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  
  const { grades, isLoading, addGrade, updateGrade } = useGrades(user?.tenantId || '');
  
  const { sections, isLoading: sectionsLoading, addSection, updateSection, toggleSectionStatus } = 
    useSections(
      selectedGradeId || '', 
      user?.schoolId || '', 
      // TODO: Replace with actual active academic session ID
      'current_session_id'
    );

  // Check if user has access to this page
  if (user?.role !== 'tenant_admin' && user?.role !== 'school_admin') {
    return (
      <AccessDenied message="Only tenant administrators and school administrators can access this page." />
    );
  }

  // Only tenant admins can add/edit grades, school admins can only view
  const canManageGrades = user?.role === 'tenant_admin';

  const handleAddOrUpdateGrade = async (newGradeData: Partial<Grade>) => {
    if (!user?.tenantId) return;
    
    let success;
    if (isEditMode && selectedGrade) {
      success = await updateGrade(selectedGrade.id, {
        ...newGradeData,
        tenantId: user.tenantId,
      });
    } else {
      success = await addGrade({
        ...newGradeData,
        tenantId: user.tenantId,
      } as Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>);
    }

    if (success) {
      setIsDialogOpen(false);
      setIsEditMode(false);
      setSelectedGrade(null);
    }
  };

  const handleEditClick = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleGradeSelect = (gradeId: string) => {
    setSelectedGradeId(gradeId);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading grades..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Grades</h1>
        {canManageGrades && (
          <GradeDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleAddOrUpdateGrade}
            initialGrade={selectedGrade}
            gradeOptions={GRADE_LEVELS}
            isEditMode={isEditMode}
          />
        )}
        {canManageGrades && (
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditMode(false);
              setSelectedGrade(null);
              setIsDialogOpen(true);
            }}>
              Add Grade
            </Button>
          </DialogTrigger>
        )}
      </div>

      <GradesTable 
        grades={grades}
        onGradeSelect={handleGradeSelect}
        onGradeEdit={canManageGrades ? handleEditClick : undefined}
        selectedGradeId={selectedGradeId}
        canManageGrades={canManageGrades}
      />
      
      {selectedGradeId ? (
        <div className="mt-8">
          <SectionsManager
            sections={sections}
            isLoading={sectionsLoading}
            onAddSection={addSection}
            onUpdateSection={updateSection}
            onToggleStatus={toggleSectionStatus}
          />
        </div>
      ) : (
        <div className="text-center text-muted-foreground p-4 bg-background border rounded">
          <p>Select a grade to view and manage its sections</p>
        </div>
      )}
    </div>
  );
};

export default Grades;
