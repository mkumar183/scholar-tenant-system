
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAcademicSessions } from '@/hooks/useAcademicSessions';
import { Button } from '@/components/ui/button';
import { AcademicSessionDialog } from '@/components/academic-sessions/AcademicSessionDialog';
import { AcademicSessionsTable } from '@/components/academic-sessions/AcademicSessionsTable';
import { AcademicSessionDetails } from '@/components/academic-sessions/AcademicSessionDetails';
import { CalendarRange } from 'lucide-react';
import { AcademicSession } from '@/types/database.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AcademicSessions = () => {
  const { user } = useAuth();
  const { 
    sessions, 
    isLoading, 
    createSession, 
    updateSession, 
    deleteSession,
    setActiveSession 
  } = useAcademicSessions();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const handleCreateSession = async (session: Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>) => {
    await createSession(session);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateSession = async (id: string, updates: Partial<Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>>) => {
    await updateSession(id, updates);
  };

  const handleDeleteSession = async (id: string) => {
    await deleteSession(id);
    if (selectedSessionId === id) {
      setSelectedSessionId(null);
    }
  };

  const handleSetActiveSession = async (id: string) => {
    await setActiveSession(id);
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  // Only tenant admins can access this page
  if (user?.role !== 'tenant_admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Only tenant administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Academic Sessions</h1>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New Session
        </Button>
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList>
          <TabsTrigger value="sessions">All Sessions</TabsTrigger>
          {selectedSession && (
            <TabsTrigger value="details">
              {selectedSession.name} Details
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="sessions" className="mt-4">
          <div className="rounded-md border shadow-sm">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <AcademicSessionsTable 
                sessions={sessions} 
                onEdit={handleUpdateSession} 
                onDelete={handleDeleteSession}
                onSetActive={handleSetActiveSession}
                onSelect={setSelectedSessionId}
              />
            )}
          </div>
        </TabsContent>
        
        {selectedSession && (
          <TabsContent value="details" className="mt-4">
            <AcademicSessionDetails session={selectedSession} />
          </TabsContent>
        )}
      </Tabs>

      <AcademicSessionDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateSession}
      />
    </div>
  );
};

export default AcademicSessions;
