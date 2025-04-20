
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeeAssignment } from '../../mock/feeAssignments';
import { useFeeManagement } from '../../contexts/FeeManagementContext';
import { mockGrades, mockStreams, mockAcademicSessions, mockTerms } from '../../mock/mockData';

interface FeeAssignmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialAssignment?: FeeAssignment | null;
  isEditMode: boolean;
}

const FeeAssignmentDialog = ({
  isOpen,
  onOpenChange,
  initialAssignment,
  isEditMode,
}: FeeAssignmentDialogProps) => {
  const { feeGroups, addFeeAssignment, updateFeeAssignment } = useFeeManagement();
  
  const [assignment, setAssignment] = useState<{
    feeGroupId: string;
    gradeId: string;
    gradeName: string;
    streamId?: string;
    streamName?: string;
    academicSessionId: string;
    academicSessionName: string;
    termId?: string;
    termName?: string;
    tenantId: string;
  }>({
    feeGroupId: '',
    gradeId: '',
    gradeName: '',
    streamId: '',
    streamName: '',
    academicSessionId: '',
    academicSessionName: '',
    termId: '',
    termName: '',
    tenantId: '1', // Default tenant ID for mock data
  });

  // Filtered options for terms based on selected academic session
  const [filteredTerms, setFilteredTerms] = useState(mockTerms);

  useEffect(() => {
    if (initialAssignment) {
      setAssignment({
        feeGroupId: initialAssignment.feeGroupId,
        gradeId: initialAssignment.gradeId,
        gradeName: initialAssignment.gradeName,
        streamId: initialAssignment.streamId,
        streamName: initialAssignment.streamName,
        academicSessionId: initialAssignment.academicSessionId,
        academicSessionName: initialAssignment.academicSessionName,
        termId: initialAssignment.termId,
        termName: initialAssignment.termName,
        tenantId: initialAssignment.tenantId,
      });
    } else if (!isOpen) {
      // Reset form when dialog is closed
      setAssignment({
        feeGroupId: '',
        gradeId: '',
        gradeName: '',
        streamId: '',
        streamName: '',
        academicSessionId: '',
        academicSessionName: '',
        termId: '',
        termName: '',
        tenantId: '1',
      });
    }
  }, [initialAssignment, isOpen]);

  // Update filtered terms whenever the academic session changes
  useEffect(() => {
    if (assignment.academicSessionId) {
      setFilteredTerms(mockTerms.filter(term => term.academicSessionId === assignment.academicSessionId));
    } else {
      setFilteredTerms([]);
    }
  }, [assignment.academicSessionId]);

  const handleFeeGroupChange = (value: string) => {
    const selectedGroup = feeGroups.find(group => group.id === value);
    setAssignment(prev => ({
      ...prev,
      feeGroupId: value
    }));
  };

  const handleGradeChange = (value: string) => {
    const selectedGrade = mockGrades.find(grade => grade.id === value);
    setAssignment(prev => ({
      ...prev,
      gradeId: value,
      gradeName: selectedGrade?.name || ''
    }));
  };

  const handleStreamChange = (value: string) => {
    const selectedStream = mockStreams.find(stream => stream.id === value);
    setAssignment(prev => ({
      ...prev,
      streamId: value,
      streamName: selectedStream?.name || ''
    }));
  };

  const handleAcademicSessionChange = (value: string) => {
    const selectedSession = mockAcademicSessions.find(session => session.id === value);
    setAssignment(prev => ({
      ...prev,
      academicSessionId: value,
      academicSessionName: selectedSession?.name || '',
      termId: '', // Reset term when session changes
      termName: ''
    }));
  };

  const handleTermChange = (value: string) => {
    const selectedTerm = mockTerms.find(term => term.id === value);
    setAssignment(prev => ({
      ...prev,
      termId: value,
      termName: selectedTerm?.name || ''
    }));
  };

  const handleSubmit = () => {
    if (isEditMode && initialAssignment) {
      updateFeeAssignment(initialAssignment.id, assignment);
    } else {
      addFeeAssignment(assignment);
    }
    onOpenChange(false);
  };

  const isFormValid = () => {
    return (
      assignment.feeGroupId &&
      assignment.gradeId &&
      assignment.academicSessionId
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Fee Assignment' : 'Assign Fee Group'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fee Group*</label>
            <Select
              value={assignment.feeGroupId}
              onValueChange={handleFeeGroupChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a fee group" />
              </SelectTrigger>
              <SelectContent>
                {feeGroups.map(group => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Grade*</label>
            <Select
              value={assignment.gradeId}
              onValueChange={handleGradeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a grade" />
              </SelectTrigger>
              <SelectContent>
                {mockGrades.map(grade => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stream (Optional)</label>
            <Select
              value={assignment.streamId || ''}
              onValueChange={handleStreamChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a stream (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Streams</SelectItem>
                {mockStreams.map(stream => (
                  <SelectItem key={stream.id} value={stream.id}>
                    {stream.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Academic Session*</label>
            <Select
              value={assignment.academicSessionId}
              onValueChange={handleAcademicSessionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an academic session" />
              </SelectTrigger>
              <SelectContent>
                {mockAcademicSessions.map(session => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Term (Optional)</label>
            <Select
              value={assignment.termId || ''}
              onValueChange={handleTermChange}
              disabled={!assignment.academicSessionId}
            >
              <SelectTrigger>
                <SelectValue placeholder={assignment.academicSessionId ? "Select a term (optional)" : "Select academic session first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Terms</SelectItem>
                {filteredTerms.map(term => (
                  <SelectItem key={term.id} value={term.id}>
                    {term.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid()}
            className="w-full"
          >
            {isEditMode ? 'Update Assignment' : 'Create Assignment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeeAssignmentDialog;
