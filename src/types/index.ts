
export type Section = {
  id: string;
  name: string;
  school_id: string;
  grade_id: string;
  academic_session_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Grade = {
  id: string;
  name: string;
  level: number;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
};

export type Student = {
  id: string;
  name: string;
  role: 'student';
  tenant_id: string;
  school_id: string;
  created_at: string;
  updated_at: string;
  // Add other student-specific properties as needed
};

export type Teacher = {
  id: string;
  name: string;
  role: 'teacher' | 'staff' | 'school_admin';
  tenant_id: string;
  school_id: string;
  created_at: string;
  updated_at: string;
  // Add other teacher-specific properties as needed
};
