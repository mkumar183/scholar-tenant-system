export interface Teacher {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  schoolId: string;
  schoolName?: string;
  subjects: string[];
  password?: string;
}

export interface Student {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  schoolId: string;
  schoolName?: string;
  grade: string;
  guardianName: string;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  type?: string;
  tenantId: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
} 