import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddStudentFormProps {
  newStudent: {
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    grade: string;
    guardianName: string;
    dateOfBirth: string;
  };
  setNewStudent: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    grade: string;
    guardianName: string;
    dateOfBirth: string;
  }>>;
  schools: { id: string; name: string }[];
  grades: string[];
}

const AddStudentForm = ({ newStudent, setNewStudent, schools, grades }: AddStudentFormProps) => {
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
        <Label htmlFor="student-school">School</Label>
        <Select 
          value={newStudent.schoolId} 
          onValueChange={(value) => setNewStudent({...newStudent, schoolId: value})}
        >
          <SelectTrigger className="mt-1">
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
      </div>
      <div>
        <Label htmlFor="student-grade">Grade</Label>
        <Select 
          value={newStudent.grade} 
          onValueChange={(value) => setNewStudent({...newStudent, grade: value})}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
    </div>
  );
};

export default AddStudentForm;
