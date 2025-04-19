
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Grade } from '@/types';
import { useGrades } from '@/hooks/useGrades';
import { useSections } from '@/hooks/useSections';
import AccessDenied from '@/components/common/AccessDenied';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { supabase } from '@/lib/supabase';
import SectionsManager from '@/components/sections/SectionsManager';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Sections = () => {
  const { user } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [activeAcademicSession, setActiveAcademicSession] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  
  const { grades, isLoading: gradesLoading } = useGrades(user?.tenantId || '');
  
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
        
        if (error) throw error;
        setActiveAcademicSession(data?.id || null);
      } catch (error) {
        console.error('Error fetching academic session:', error);
        setActiveAcademicSession(null);
      } finally {
        setIsLoadingSession(false);
      }
    };
    
    fetchActiveSession();
  }, [user?.tenantId]);
  
  const { 
    sections,
    isLoading: sectionsLoading,
    addSection,
    updateSection,
    toggleSectionStatus
  } = useSections(
    selectedGrade?.id || '',
    user?.schoolId || '',
    activeAcademicSession || ''
  );
  
  // Basic access check
  if (user?.role !== 'school_admin') {
    return <AccessDenied message="Only school administrators can access this page." />;
  }
  
  if (gradesLoading || isLoadingSession) {
    return <LoadingSpinner message="Loading..." />;
  }
  
  if (!activeAcademicSession) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg text-red-600">No active academic session found.</p>
        <p className="text-sm text-muted-foreground">Please set an active academic session to manage sections.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Sections Management</h1>
        <p className="text-muted-foreground">Manage class sections and student enrollments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {grades.map((grade) => (
          <Card 
            key={grade.id}
            className={`cursor-pointer transition-colors hover:border-primary ${
              selectedGrade?.id === grade.id ? 'border-primary' : ''
            }`}
            onClick={() => setSelectedGrade(grade)}
          >
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex items-center justify-between">
                Grade {grade.name}
                <Badge variant={selectedGrade?.id === grade.id ? "default" : "outline"}>
                  {sections.length} sections
                </Badge>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedGrade && (
        <Tabs defaultValue="sections" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sections" className="space-y-4">
            <SectionsManager
              sections={sections}
              isLoading={sectionsLoading}
              onAddSection={addSection}
              onUpdateSection={updateSection}
              onToggleStatus={toggleSectionStatus}
            />
          </TabsContent>
          
          <TabsContent value="enrollments">
            {/* We'll implement the enrollment management UI in the next iteration */}
            <p className="text-muted-foreground">Student enrollment management coming soon...</p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Sections;
