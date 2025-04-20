
import React from 'react';

interface DebugPanelProps {
  userRole: string;
  hasSchoolId: boolean;
  schoolId: string;
  canManageSections: boolean;
  selectedGradeId: string | null;
  activeSession: boolean;
}

const DebugPanel = ({
  userRole,
  hasSchoolId,
  schoolId,
  canManageSections,
  selectedGradeId,
  activeSession
}: DebugPanelProps) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4 text-sm">
      <h3 className="font-semibold">Debug Info:</h3>
      <ul className="list-disc pl-5 mt-1">
        <li>Role: {userRole}</li>
        <li>Has School ID: {hasSchoolId ? 'Yes' : 'No'}</li>
        <li>School ID: {schoolId}</li>
        <li>Can Manage Sections: {canManageSections ? 'Yes' : 'No'}</li>
        <li>Selected Grade: {selectedGradeId || 'None'}</li>
        <li>Active Session: {activeSession ? 'Yes' : 'No'}</li>
      </ul>
    </div>
  );
};

export default DebugPanel;
