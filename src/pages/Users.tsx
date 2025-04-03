
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, User, School, Search, Mail, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const MOCK_TEACHERS = [
  {
    id: 'teacher-1',
    name: 'Emma Johnson',
    email: 'emma.johnson@school.edu',
    phone: '(555) 123-4567',
    role: 'teacher',
    schoolId: 'school-1',
    schoolName: 'Lincoln High School',
    subjects: ['Mathematics', 'Physics'],
  },
  {
    id: 'teacher-2',
    name: 'Michael Brown',
    email: 'michael.brown@school.edu',
    phone: '(555) 234-5678',
    role: 'teacher',
    schoolId: 'school-1',
    schoolName: 'Lincoln High School',
    subjects: ['English Literature', 'History'],
  },
  {
    id: 'teacher-3',
    name: 'Sophia Williams',
    email: 'sophia.williams@school.edu',
    phone: '(555) 345-6789',
    role: 'teacher',
    schoolId: 'school-2',
    schoolName: 'Washington Middle School',
    subjects: ['Biology', 'Chemistry'],
  },
];

const MOCK_STUDENTS = [
  {
    id: 'student-1',
    name: 'Alex Martinez',
    email: 'alex.martinez@school.edu',
    phone: '(555) 456-7890',
    role: 'student',
    schoolId: 'school-1',
    schoolName: 'Lincoln High School',
    grade: '10',
    guardianName: 'Maria Martinez',
  },
  {
    id: 'student-2',
    name: 'Taylor Wilson',
    email: 'taylor.wilson@school.edu',
    phone: '(555) 567-8901',
    role: 'student',
    schoolId: 'school-1',
    schoolName: 'Lincoln High School',
    grade: '11',
    guardianName: 'Robert Wilson',
  },
  {
    id: 'student-3',
    name: 'Jamie Lee',
    email: 'jamie.lee@school.edu',
    phone: '(555) 678-9012',
    role: 'student',
    schoolId: 'school-2',
    schoolName: 'Washington Middle School',
    grade: '8',
    guardianName: 'Sarah Lee',
  },
];

const MOCK_SCHOOLS = [
  { id: 'school-1', name: 'Lincoln High School' },
  { id: 'school-2', name: 'Washington Middle School' },
  { id: 'school-3', name: 'Roosevelt Elementary' },
  { id: 'school-4', name: 'Edison Academy' },
];

const SUBJECTS = [
  'Mathematics',
  'English Literature',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
];

const GRADES = ['6', '7', '8', '9', '10', '11', '12'];

const Users = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    schoolId: '',
    subjects: [''],
  });
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    schoolId: '',
    grade: '',
    guardianName: '',
  });

  // Filter data based on search
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new teacher
  const handleAddTeacher = () => {
    const id = `teacher-${teachers.length + 1}`;
    const schoolName = MOCK_SCHOOLS.find(s => s.id === newTeacher.schoolId)?.name || '';
    
    const newTeacherData = {
      ...newTeacher,
      id,
      role: 'teacher',
      schoolName,
      subjects: [newTeacher.subjects[0]],
    };
    
    setTeachers([...teachers, newTeacherData]);
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      schoolId: '',
      subjects: [''],
    });
    setIsAddDialogOpen(false);
    toast.success('Teacher added successfully');
  };

  // Add new student
  const handleAddStudent = () => {
    const id = `student-${students.length + 1}`;
    const schoolName = MOCK_SCHOOLS.find(s => s.id === newStudent.schoolId)?.name || '';
    
    const newStudentData = {
      ...newStudent,
      id,
      role: 'student',
      schoolName,
    };
    
    setStudents([...students, newStudentData]);
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      schoolId: '',
      grade: '',
      guardianName: '',
    });
    setIsAddDialogOpen(false);
    toast.success('Student added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New {activeTab === 'teachers' ? 'Teacher' : 'Student'}</DialogTitle>
              <DialogDescription>
                Register a new {activeTab === 'teachers' ? 'teacher' : 'student'} in the system
              </DialogDescription>
            </DialogHeader>
            {activeTab === 'teachers' ? (
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
                      {MOCK_SCHOOLS.map((school) => (
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
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
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
                      {MOCK_SCHOOLS.map((school) => (
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
                      {GRADES.map((grade) => (
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
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={activeTab === 'teachers' ? handleAddTeacher : handleAddStudent}>
                Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teachers">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {teacher.name.charAt(0)}
                    </div>
                    {teacher.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {teacher.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      {teacher.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <School className="mr-2 h-4 w-4 text-muted-foreground" />
                      {teacher.schoolName}
                    </div>
                    <div className="pt-2">
                      <div className="text-xs text-muted-foreground mb-1">Subjects</div>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((subject) => (
                          <span 
                            key={subject} 
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredTeachers.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No teachers found</h3>
              <p className="text-muted-foreground">Try adjusting your search or add a new teacher.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="students">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <Card key={student.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                      {student.name.charAt(0)}
                    </div>
                    {student.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {student.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      {student.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <School className="mr-2 h-4 w-4 text-muted-foreground" />
                      {student.schoolName}
                    </div>
                    <div className="grid grid-cols-2 pt-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Grade</div>
                        <div className="text-sm">{student.grade}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Guardian</div>
                        <div className="text-sm">{student.guardianName}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No students found</h3>
              <p className="text-muted-foreground">Try adjusting your search or add a new student.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;
