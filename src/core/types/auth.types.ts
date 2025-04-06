
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId?: string;
  schoolId?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: 'admin' | 'school_admin' | 'teacher' | 'student') => Promise<void>;
  logout: () => Promise<void>;
}
