
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
import { Textarea } from '@/components/ui/textarea';
import { Holiday } from '@/types/database.types';
import { toast } from 'sonner';

interface HolidayDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (holiday: Omit<Holiday, 'id' | 'created_at' | 'updated_at'>) => void;
  holiday?: Holiday;
  isEditing?: boolean;
  academicSessionId: string;
  sessionStartDate: Date;
  sessionEndDate: Date;
}

export function HolidayDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  holiday, 
  isEditing = false,
  academicSessionId,
  sessionStartDate,
  sessionEndDate
}: HolidayDialogProps) {
  const [name, setName] = useState(holiday?.name || '');
  const [date, setDate] = useState<Date | undefined>(
    holiday?.date ? new Date(holiday.date) : undefined
  );
  const [description, setDescription] = useState(holiday?.description || '');
  
  useEffect(() => {
    if (isOpen) {
      setName(holiday?.name || '');
      setDate(holiday?.date ? new Date(holiday.date) : undefined);
      setDescription(holiday?.description || '');
    }
  }, [isOpen, holiday]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (isBefore(date, sessionStartDate) || isAfter(date, sessionEndDate)) {
      toast.error('Holiday date must be within the academic session period');
      return;
    }
    
    onSave({
      name,
      date: date.toISOString(),
      description,
      academic_session_id: academicSessionId,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Holiday' : 'Add Holiday'}</DialogTitle>
          <DialogDescription>
            Define a holiday within the academic session.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Winter Break" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Add details about this holiday" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
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
