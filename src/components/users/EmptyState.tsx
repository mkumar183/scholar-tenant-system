
import { User } from 'lucide-react';

interface EmptyStateProps {
  type: 'teachers' | 'students';
}

const EmptyState = ({ type }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">No {type} found</h3>
      <p className="text-muted-foreground">Try adjusting your search or add a new {type === 'teachers' ? 'teacher' : 'student'}.</p>
    </div>
  );
};

export default EmptyState;
