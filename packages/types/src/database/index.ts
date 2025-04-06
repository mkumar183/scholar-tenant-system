import { UserRole } from '../auth';

export interface Tenant {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  tenantId: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  role: UserRole;
  tenantId?: string;
  schoolId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseError {
  message: string;
  code: string;
  details?: string;
  hint?: string;
} 