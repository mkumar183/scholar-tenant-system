
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useGrades } from '@/hooks/useGrades';
import { Grade } from '@/types';
import { useSections } from '@/hooks/useSections';
import SectionsManager from '@/components/sections/SectionsManager';
import GradeDialog from '@/components/grades/GradeDialog';
import GradesTable from '@/components/grades/GradesTable';
import AccessDenied from '@/components/common/AccessDenied';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Remove console log too
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
  const [activeAcademicSession, setActiveAcademicSession] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  
  // Remove debug state and logging functions
  
  const { grades, isLoading, addGrade, updateGrade } = useGrades(user?.tenantId || '');
  
  // Fetch active academic session
  useEffect(() => {
    const fetchActiveSession = async () => {
      if (!user?.tenantId) {
        setIsLoadingSession(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('academic_sessions')
          .select('id')
          .eq('tenant_id', user.tenantId)
          .eq('is_active', true)
          .single();
        
        if (error) {
          console.error('Error fetching academic session:', error);
          setActiveAcademicSession(null);
        } else {
          setActiveAcademicSession(data?.id || null);
        }
      } catch (error: any) {
        console.error('Error in fetchActiveSession:', error);
        setActiveAcademicSession(null);
      } finally {
        setIsLoadingSession(false);
      }
    };
    
    fetchActiveSession();
  }, [user?.tenantId]);
  
  // Only load sections for school admins since they have a schoolId
  const canManageSections = user?.role === 'school_admin' && !!user?.schoolId;
  
  // Use the sections hook only if the user is a school admin
  const { 
    sections: hookSections, 
    isLoading: sectionsLoading, 
    addSection, 
    updateSection, 
    toggleSectionStatus 
  } = useSections(
    selectedGradeId || '', 
    user?.schoolId || '', // Revert back to using string instead of null
    activeAcademicSession || ''
  );
  
  // Simplified grade selection handler
  const handleGradeSelect = (gradeId: string) => {
    setSelectedGradeId(gradeId);
  };
  
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
  
  // Basic access check
  if (user?.role !== 'tenant_admin' && user?.role !== 'school_admin') {
    return <AccessDenied message="Only tenant administrators and school administrators can access this page." />;
  }
  
  // Only tenant admins can add/edit grades
  const canManageGrades = user?.role === 'tenant_admin';
  
  // Loading states
  if (isLoading) {
    return <LoadingSpinner message="Loading grades..." />;
  }
  
  if (isLoadingSession) {
    return <LoadingSpinner message="Loading academic session..." />;
  }
  
  // Warning if no active session
  if (!activeAcademicSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Active Academic Session</h1>
          <p className="text-muted-foreground mb-4">To manage grades and sections, an active academic session is required.</p>
          <p className="text-muted-foreground">Please set an active academic session in the Academic Sessions page.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Grades</h1>
        {canManageGrades && (
          <>
            <GradeDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onSubmit={handleAddOrUpdateGrade}
              initialGrade={selectedGrade}
              gradeOptions={GRADE_LEVELS}
              isEditMode={isEditMode}
            />
            
            <Button onClick={() => {
              setIsEditMode(false);
              setSelectedGrade(null);
              setIsDialogOpen(true);
            }}>
              Add Grade
            </Button>
          </>
        )}
      </div>
      
      <GradesTable 
        grades={grades}
        onGradeSelect={handleGradeSelect}
        onGradeEdit={canManageGrades ? handleEditClick : undefined}
        selectedGradeId={selectedGradeId}
        canManageGrades={canManageGrades}
      />
      
      {selectedGradeId && canManageSections && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Sections for Selected Grade</h3>
          
          {sectionsLoading ? (
            <div className="p-8 border border-dashed rounded-md text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2 mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading sections data...</p>
            </div>
          ) : (
            <React.Fragment>
              {hookSections.length > 0 ? (
                <SectionsManager
                  sections={hookSections}
                  isLoading={false}
                  onAddSection={addSection}
                  onUpdateSection={updateSection}
                  onToggleStatus={toggleSectionStatus}
                />
              ) : (
                <div className="p-4 border rounded-md text-center">
                  <p className="text-muted-foreground">No sections found for this grade</p>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      )}
      
      {selectedGradeId && !canManageSections && (
        <div className="mt-8 p-4 border rounded-md">
          <p className="text-muted-foreground text-center">
            Only school administrators can manage sections. Tenant administrators cannot manage sections directly.
          </p>
        </div>
      )}
      
      {!selectedGradeId && (
        <div className="text-center text-muted-foreground p-4 bg-background border rounded">
          <p>Select a grade to view and manage its sections</p>
        </div>
      )}
    </div>
  );
};

export default Grades;
