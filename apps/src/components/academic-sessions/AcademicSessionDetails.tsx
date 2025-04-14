
import { useState, useEffect } from 'react';
import { useTerms } from '@/hooks/useTerms';
import { useHolidays } from '@/hooks/useHolidays';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AcademicSession, Term, Holiday } from '@/types/database.types';
import { TermDialog } from './TermDialog';
import { HolidayDialog } from './HolidayDialog';
import { format } from 'date-fns';
import { CalendarClock, CalendarDays, Trash2, Edit, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AcademicSessionDetailsProps {
  session: AcademicSession;
}

export function AcademicSessionDetails({ session }: AcademicSessionDetailsProps) {
  const { terms, isLoading: isLoadingTerms, fetchTerms, createTerm, updateTerm, deleteTerm } = useTerms();
  const { holidays, isLoading: isLoadingHolidays, fetchHolidays, createHoliday, updateHoliday, deleteHoliday } = useHolidays();

  const [isTermDialogOpen, setIsTermDialogOpen] = useState(false);
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<Term | undefined>(undefined);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | undefined>(undefined);
  const [isDeleteTermDialogOpen, setIsDeleteTermDialogOpen] = useState(false);
  const [isDeleteHolidayDialogOpen, setIsDeleteHolidayDialogOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState<string | null>(null);
  const [holidayToDelete, setHolidayToDelete] = useState<string | null>(null);

  const sessionStartDate = new Date(session.start_date);
  const sessionEndDate = new Date(session.end_date);

  useEffect(() => {
    if (session?.id) {
      fetchTerms(session.id);
      fetchHolidays(session.id);
    }
  }, [session?.id]);

  const handleCreateTerm = async (term: Omit<Term, 'id' | 'created_at' | 'updated_at'>) => {
    await createTerm(term);
    setIsTermDialogOpen(false);
  };

  const handleUpdateTerm = async (id: string, updates: Partial<Omit<Term, 'id' | 'created_at' | 'updated_at'>>) => {
    await updateTerm(id, updates);
    setIsTermDialogOpen(false);
    setSelectedTerm(undefined);
  };

  const handleCreateHoliday = async (holiday: Omit<Holiday, 'id' | 'created_at' | 'updated_at'>) => {
    await createHoliday(holiday);
    setIsHolidayDialogOpen(false);
  };

  const handleUpdateHoliday = async (id: string, updates: Partial<Omit<Holiday, 'id' | 'created_at' | 'updated_at'>>) => {
    await updateHoliday(id, updates);
    setIsHolidayDialogOpen(false);
    setSelectedHoliday(undefined);
  };

  const openDeleteTermDialog = (id: string) => {
    setTermToDelete(id);
    setIsDeleteTermDialogOpen(true);
  };

  const openDeleteHolidayDialog = (id: string) => {
    setHolidayToDelete(id);
    setIsDeleteHolidayDialogOpen(true);
  };

  const confirmDeleteTerm = async () => {
    if (termToDelete) {
      await deleteTerm(termToDelete);
      setIsDeleteTermDialogOpen(false);
      setTermToDelete(null);
    }
  };

  const confirmDeleteHoliday = async () => {
    if (holidayToDelete) {
      await deleteHoliday(holidayToDelete);
      setIsDeleteHolidayDialogOpen(false);
      setHolidayToDelete(null);
    }
  };

  if (isLoadingTerms || isLoadingHolidays) {
    return <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5" />
                  Terms
                </CardTitle>
                <CardDescription>Academic terms within this session</CardDescription>
              </div>
              <Button size="sm" onClick={() => {
                setSelectedTerm(undefined);
                setIsTermDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-1" /> Add Term
              </Button>
            </CardHeader>
            <CardContent>
              {terms.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No terms defined for this session
                </div>
              ) : (
                <div className="space-y-4">
                  {terms.map((term) => (
                    <Card key={term.id} className="border shadow-sm">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">{term.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {format(new Date(term.start_date), "PPP")} - {format(new Date(term.end_date), "PPP")}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                          setSelectedTerm(term);
                          setIsTermDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => openDeleteTermDialog(term.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Holidays
                </CardTitle>
                <CardDescription>Holidays and breaks within this session</CardDescription>
              </div>
              <Button size="sm" onClick={() => {
                setSelectedHoliday(undefined);
                setIsHolidayDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-1" /> Add Holiday
              </Button>
            </CardHeader>
            <CardContent>
              {holidays.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No holidays defined for this session
                </div>
              ) : (
                <div className="space-y-4">
                  {holidays.map((holiday) => (
                    <Card key={holiday.id} className="border shadow-sm">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">{holiday.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          <span>{format(new Date(holiday.date), "PPP")}</span>
                        </div>
                        {holiday.description && (
                          <p className="mt-2 text-sm">{holiday.description}</p>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                          setSelectedHoliday(holiday);
                          setIsHolidayDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => openDeleteHolidayDialog(holiday.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Term Dialog */}
      <TermDialog
        isOpen={isTermDialogOpen}
        onClose={() => {
          setIsTermDialogOpen(false);
          setSelectedTerm(undefined);
        }}
        onSave={selectedTerm 
          ? (updates) => handleUpdateTerm(selectedTerm.id, updates) 
          : handleCreateTerm
        }
        term={selectedTerm}
        isEditing={!!selectedTerm}
        academicSessionId={session.id}
        sessionStartDate={sessionStartDate}
        sessionEndDate={sessionEndDate}
      />

      {/* Holiday Dialog */}
      <HolidayDialog
        isOpen={isHolidayDialogOpen}
        onClose={() => {
          setIsHolidayDialogOpen(false);
          setSelectedHoliday(undefined);
        }}
        onSave={selectedHoliday 
          ? (updates) => handleUpdateHoliday(selectedHoliday.id, updates) 
          : handleCreateHoliday
        }
        holiday={selectedHoliday}
        isEditing={!!selectedHoliday}
        academicSessionId={session.id}
        sessionStartDate={sessionStartDate}
        sessionEndDate={sessionEndDate}
      />

      {/* Delete Term Confirmation Dialog */}
      <Dialog open={isDeleteTermDialogOpen} onOpenChange={setIsDeleteTermDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Term</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this term? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteTermDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteTerm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Holiday Confirmation Dialog */}
      <Dialog open={isDeleteHolidayDialogOpen} onOpenChange={setIsDeleteHolidayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Holiday</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this holiday? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteHolidayDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteHoliday}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
