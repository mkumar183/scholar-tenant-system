
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddTeacherFormProps {
  newTeacher: {
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    subjects: string[];
  };
  setNewTeacher: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    schoolId: string;
    subjects: string[];
  }>>;
  schools: { id: string; name: string }[];
  subjects: string[];
}

const AddTeacherForm = ({ newTeacher, setNewTeacher, schools, subjects }: AddTeacherFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="teacher-name">Name</Label>
        <Input
          id="teacher-name"
          value={newTeacher.name}
          onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="teacher-email">Email</Label>
        <Input
          id="teacher-email"
          type="email"
          value={newTeacher.email}
          onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="teacher-phone">Phone</Label>
        <Input
          id="teacher-phone"
          value={newTeacher.phone}
          onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="teacher-school">School</Label>
        <Select 
          value={newTeacher.schoolId} 
          onValueChange={(value) => setNewTeacher({...newTeacher, schoolId: value})}
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
        <Label htmlFor="teacher-subject">Primary Subject</Label>
        <Select 
          value={newTeacher.subjects[0]} 
          onValueChange={(value) => setNewTeacher({...newTeacher, subjects: [value]})}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AddTeacherForm;
