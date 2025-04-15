import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface AddTeacherFormProps {
  newTeacher: {
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    password: string;
    role: string;
  };
  setNewTeacher: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    password: string;
    role: string;
  }>>;
  schools: { id: string; name: string }[];
}

const AddTeacherForm = ({ newTeacher, setNewTeacher, schools }: AddTeacherFormProps) => {
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    schoolId?: string;
    password?: string;
    role?: string;
  }>({});

  const validateField = (field: string, value: string) => {
    if (field === 'name' && !value) {
      return 'Name is required';
    }
    if (field === 'email') {
      if (!value) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Invalid email format';
    }
    if (field === 'schoolId' && !value) {
      return 'School selection is required';
    }
    if (field === 'password') {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
    }
    if (field === 'role' && !value) {
      return 'Role selection is required';
    }
    return '';
  };

  const handleChange = (field: string, value: string) => {
    // Validate and update errors
    const errorMessage = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));

    // Update form data
    setNewTeacher({...newTeacher, [field]: value});
  };

  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="teacher-name">Name <span className="text-red-500">*</span></Label>
        <Input
          id="teacher-name"
          value={newTeacher.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="teacher-email">Email <span className="text-red-500">*</span></Label>
        <Input
          id="teacher-email"
          type="email"
          value={newTeacher.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="teacher-password">Initial Password <span className="text-red-500">*</span></Label>
        <Input
          id="teacher-password"
          type="password"
          value={newTeacher.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
          placeholder="Enter initial password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <div>
        <Label htmlFor="teacher-phone">Phone</Label>
        <Input
          id="teacher-phone"
          value={newTeacher.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="teacher-school">School <span className="text-red-500">*</span></Label>
        <Select 
          value={newTeacher.schoolId} 
          onValueChange={(value) => handleChange('schoolId', value)}
        >
          <SelectTrigger className={`mt-1 ${errors.schoolId ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select school" />
          </SelectTrigger>
          <SelectContent>
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.schoolId && <p className="text-red-500 text-sm mt-1">{errors.schoolId}</p>}
      </div>
      <div>
        <Label htmlFor="teacher-role">Role <span className="text-red-500">*</span></Label>
        <Select 
          value={newTeacher.role} 
          onValueChange={(value) => handleChange('role', value)}
        >
          <SelectTrigger className={`mt-1 ${errors.role ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="school_admin">School Admin</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
      </div>
    </div>
  );
};

export default AddTeacherForm;
