import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGrades } from '@/hooks/useGrades';
import { Grade } from '@/types';
import { useSections } from '@/hooks/useSections';
import AccessDenied from '@/components/common/AccessDenied';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import NoActiveSessionMessage from '@/components/grades/NoActiveSessionMessage';
import GradeSectionsArea from '@/components/grades/GradeSectionsArea';
import GradesHeader from '@/components/grades/GradesHeader';
import GradeButtons from '@/components/grades/GradeButtons';
import GradesTableView from '@/components/grades/GradesTableView';
import { supabase } from '@/lib/supabase';

// Grade level definitions
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
  
  // Debug info state
  const [debugInfo, setDebugInfo] = useState({
    userRole: '',
    hasSchoolId: false,
    schoolId: '',
    canManageSections: false
  });
  
  const { grades, isLoading, addGrade, updateGrade } = useGrades(user?.tenantId || '');
  
  // Update debug info whenever relevant user info changes
  useEffect(() => {
    if (user) {
      setDebugInfo({
        userRole: user.role,
        hasSchoolId: !!user.schoolId,
        schoolId: user.schoolId || 'none',
        canManageSections: user.role === 'school_admin' && !!user.schoolId
      });
      
      console.log('User info for sections access:', {
        role: user.role,
        schoolId: user.schoolId,
        tenantId: user.tenantId,
        canManageSections: user.role === 'school_admin' && !!user.schoolId
      });
    }
  }, [user]);
  
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
  
  // Only load sections for school admins with a schoolId
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
    user?.schoolId || '', 
    activeAcademicSession || ''
  );
  
  // Add logging for sections loading
  useEffect(() => {
    if (selectedGradeId) {
      console.log('Sections loading state:', {
        selectedGradeId,
        sectionsCount: hookSections?.length || 0,
        isLoading: sectionsLoading,
        academicSession: activeAcademicSession
      });
    }
  }, [selectedGradeId, hookSections, sectionsLoading, activeAcademicSession]);
  
  // Grade selection handler
  const handleGradeSelect = (gradeId: string) => {
    setSelectedGradeId(gradeId);
    console.log('Grade selected:', gradeId);
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
    return <NoActiveSessionMessage />;
  }
  
  return (
    <div className="space-y-6">
      {canManageGrades ? (
        <>
          <GradesHeader 
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleAddOrUpdateGrade={handleAddOrUpdateGrade}
            selectedGrade={selectedGrade}
            gradeOptions={GRADE_LEVELS}
            isEditMode={isEditMode}
            canManageGrades={canManageGrades}
          />
          <GradesTableView 
            grades={grades}
            onGradeSelect={handleGradeSelect}
            onGradeEdit={handleEditClick}
            selectedGradeId={selectedGradeId}
          />
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Grades</h1>
          <GradeButtons 
            grades={grades}
            selectedGradeId={selectedGradeId}
            onGradeSelect={handleGradeSelect}
          />
        </>
      )}
      
      <GradeSectionsArea 
        selectedGradeId={selectedGradeId}
        canManageSections={canManageSections}
        sectionsLoading={sectionsLoading}
        sections={hookSections}
        addSection={addSection}
        updateSection={updateSection}
        toggleSectionStatus={toggleSectionStatus}
      />
    </div>
  );
};

export default Grades;