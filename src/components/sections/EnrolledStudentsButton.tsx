
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface EnrolledStudentsButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const EnrolledStudentsButton = ({ isOpen, onClick }: EnrolledStudentsButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="min-w-[140px]"
    >
      <Users className="h-4 w-4 mr-1" />
      View Students {isOpen ? '▼' : '▶'}
    </Button>
  );
};

export default EnrolledStudentsButton;
