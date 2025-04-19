export interface Tenant {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  admin_name: string | null;
  admin_email: string | null;
}

export interface School {
  id: string;
  tenant_id: string;
  name: string;
  address: string | null;
  type: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string | null;
  role: 'admin' | 'school_admin' | 'teacher' | 'student' | 'staff';
  tenant_id: string | null;
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  school_id: string;
  name: string;
  description: string | null;
  subject: string | null;
  grade_level: string | null;
  school_year: string | null;
  teacher_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  class_id: string;
  status: 'active' | 'completed' | 'dropped';
  enrollment_date: string;
  created_at: string;
  updated_at: string;
}

export interface AcademicSession {
  id: string;
  tenant_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Term {
  id: string;
  academic_session_id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Holiday {
  id: string;
  academic_session_id: string;
  name: string;
  date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'teacher' | 'staff' | 'school_admin';
  schoolId: string;
  schoolName: string;
  subjects: string[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student';
  schoolId: string;
  schoolName: string;
  grade: string;
  gradeId?: string;
  guardianName: string;
  dateOfBirth: string;
  admissionStatus?: string;
  admittedBy?: string;
}

export interface TenantAdminStats {
  totalSchools: number;
  totalTeachers: number;
  totalStudents: number;
  totalGrades: number;
  classesCount: number;
}

export interface SectionEnrollment {
  id: string;
  student_id: string;
  section_id: string;
  status: 'active' | 'transferred' | 'withdrawn';
  enrolled_by: string;
  enrolled_at: string;
  effective_from: string;
  effective_to: string | null;
  notes: string | null;
  student_name?: string;
  section_name?: string;
  grade_name?: string;
}

export interface StudentAdmission {
  id: string;
  student_id: string;
  school_id: string;
  grade_id: string;
  admission_date: string;
  status: 'active' | 'inactive' | 'pending';
  admitted_by: string;
  remarks: string | null;
  academic_session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  name: string;
  grade_id: string;
  school_id: string;
  academic_session_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
