
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface EnrolledStudentsButtonProps {
  count: number;
  isOpen: boolean;
  onClick: () => void;
}

const EnrolledStudentsButton = ({ count, isOpen, onClick }: EnrolledStudentsButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="min-w-[140px]"
    >
      <Users className="h-4 w-4 mr-1" />
      {count} Students {isOpen ? '▼' : '▶'}
    </Button>
  );
};

export default EnrolledStudentsButton;
