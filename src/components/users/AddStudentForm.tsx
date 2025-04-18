import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grade, School } from '@/types';
import { Textarea } from '@/components/ui/textarea';

interface AddStudentFormProps {
  newStudent: {
    name: string;
    email: string;
    phone: string;
    guardianName: string;
    dateOfBirth: string;
    gradeId: string;
    schoolId: string;
    remarks: string;
  };
  setNewStudent: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    guardianName: string;
    dateOfBirth: string;
    gradeId: string;
    schoolId: string;
    remarks: string;
  }>>;
  grades: Grade[];
  schools: School[];
  userRole?: string;
  userSchoolId?: string;
}

const AddStudentForm = ({ 
  newStudent, 
  setNewStudent, 
  grades, 
  schools,
  userRole,
  userSchoolId 
}: AddStudentFormProps) => {
  // Set the school ID automatically for school admins
  useEffect(() => {
    if (userRole === 'school_admin' && userSchoolId) {
      setNewStudent(prev => ({ ...prev, schoolId: userSchoolId }));
    }
  }, [userRole, userSchoolId, setNewStudent]);

  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="student-name">Name</Label>
        <Input
          id="student-name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="date-of-birth">Date of Birth</Label>
        <Input
          id="date-of-birth"
          type="date"
          value={newStudent.dateOfBirth}
          onChange={(e) => setNewStudent({...newStudent, dateOfBirth: e.target.value})}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="student-email">Email</Label>
        <Input
          id="student-email"
          type="email"
          value={newStudent.email}
          onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="student-phone">Phone</Label>
        <Input
          id="student-phone"
          value={newStudent.phone}
          onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="guardian-name">Guardian Name</Label>
        <Input
          id="guardian-name"
          value={newStudent.guardianName}
          onChange={(e) => setNewStudent({...newStudent, guardianName: e.target.value})}
          className="mt-1"
        />
      </div>
      
      {userRole !== 'school_admin' && (
        <div>
          <Label htmlFor="school">School</Label>
          <Select
            value={newStudent.schoolId}
            onValueChange={(value) => setNewStudent({...newStudent, schoolId: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select school" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div>
        <Label htmlFor="grade">Grade</Label>
        <Select
          value={newStudent.gradeId}
          onValueChange={(value) => setNewStudent({...newStudent, gradeId: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((grade) => (
              <SelectItem key={grade.id} value={grade.id}>{grade.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={newStudent.remarks}
          onChange={(e) => setNewStudent({...newStudent, remarks: e.target.value})}
          className="mt-1"
          placeholder="Any additional information"
        />
      </div>
    </div>
  );
};

export default AddStudentForm;
