
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format, isAfter, isBefore } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Term } from '@/types/database.types';
import { toast } from 'sonner';

interface TermDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (term: Omit<Term, 'id' | 'created_at' | 'updated_at'>) => void;
  term?: Term;
  isEditing?: boolean;
  academicSessionId: string;
  sessionStartDate: Date;
  sessionEndDate: Date;
}

export function TermDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  term, 
  isEditing = false,
  academicSessionId,
  sessionStartDate,
  sessionEndDate
}: TermDialogProps) {
  const [name, setName] = useState(term?.name || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    term?.start_date ? new Date(term.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    term?.end_date ? new Date(term.end_date) : undefined
  );
  
  useEffect(() => {
    if (isOpen) {
      setName(term?.name || '');
      setStartDate(term?.start_date ? new Date(term.start_date) : undefined);
      setEndDate(term?.end_date ? new Date(term.end_date) : undefined);
    }
  }, [isOpen, term]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (isAfter(startDate, endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    if (isBefore(startDate, sessionStartDate) || isAfter(endDate, sessionEndDate)) {
      toast.error('Term dates must be within the academic session period');
      return;
    }
    
    onSave({
      name,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      academic_session_id: academicSessionId,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Term' : 'Add Term'}</DialogTitle>
          <DialogDescription>
            Define a term with a name and date range within the academic session.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Fall Semester" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  disabled={(date) => 
                    isBefore(date, sessionStartDate) || 
                    isAfter(date, sessionEndDate)
                  }
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="endDate">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="endDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => 
                    (startDate && isBefore(date, startDate)) || 
                    isBefore(date, sessionStartDate) || 
                    isAfter(date, sessionEndDate)
                  }
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
