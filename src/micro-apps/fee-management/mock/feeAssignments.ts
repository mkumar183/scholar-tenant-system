
export interface FeeAssignment {
  id: string;
  feeGroupId: string;
  gradeId: string;
  gradeName: string;
  streamId?: string;
  streamName?: string;
  academicSessionId: string;
  academicSessionName: string;
  termId?: string;
  termName?: string;
  createdAt: string;
  tenantId: string;
}

export const mockFeeAssignments: FeeAssignment[] = [
  {
    id: "1",
    feeGroupId: "1",
    gradeId: "g10",
    gradeName: "Grade 10",
    streamId: "s1",
    streamName: "Science",
    academicSessionId: "as1",
    academicSessionName: "2025-2026",
    termId: "t1",
    termName: "Term 1",
    createdAt: "2025-04-20",
    tenantId: "1"
  },
  {
    id: "2",
    feeGroupId: "2",
    gradeId: "g11",
    gradeName: "Grade 11",
    streamId: "s1",
    streamName: "Science",
    academicSessionId: "as1",
    academicSessionName: "2025-2026",
    createdAt: "2025-04-20",
    tenantId: "1"
  },
  {
    id: "3",
    feeGroupId: "3",
    gradeId: "g9",
    gradeName: "Grade 9",
    academicSessionId: "as1",
    academicSessionName: "2025-2026",
    termId: "t2",
    termName: "Term 2",
    createdAt: "2025-04-21",
    tenantId: "1"
  }
];
