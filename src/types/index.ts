
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
  email: string;
  phone: string;
  role: 'student';
  schoolId?: string;
  schoolName?: string;
  grade?: string;
  gradeId?: string;
  guardianName: string;
  dateOfBirth?: string;
  tenant_id?: string;
  school_id?: string;
  created_at?: string;
  updated_at?: string;
  admissionStatus?: string;
  admittedBy?: string;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'teacher' | 'staff' | 'school_admin';
  schoolId: string;
  schoolName: string;
  subjects: string[];
  tenant_id?: string;
  school_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type School = {
  id: string;
  name: string;
};

export type StudentAdmission = {
  id: string;
  student_id: string;
  school_id: string;
  grade_id: string;
  admission_date: string;
  status: 'active' | 'inactive' | 'pending';
  admitted_by: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
};
