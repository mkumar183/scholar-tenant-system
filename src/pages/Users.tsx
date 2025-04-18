import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Import components
import SearchBar from '@/components/users/SearchBar';
import AddUserDialog from '@/components/users/AddUserDialog';
import TeachersList from '@/components/users/TeachersList';
import StudentsList from '@/components/users/StudentsList';

// Import mock data for subjects and grades
import { SUBJECTS, GRADES, MOCK_SCHOOLS } from '@/components/users/usersData';

interface School {
  name: string;
}

interface TeacherData {
  id: string;
  name: string;
  role: string;
  school_id: string;
  tenant_id: string;
  school: School;
}

interface StudentData {
  id: string;
  name: string;
  role: string;
  school_id: string;
  tenant_id: string;
  school: School;
  date_of_birth: string | null;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  schoolId: string;
  schoolName: string;
  subjects: string[];
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  schoolId: string;
  schoolName: string;
  grade: string;
  guardianName: string;
  dateOfBirth: string;
}

interface NewTeacher {
  name: string;
  email: string;
  phone: string;
  schoolId: string;
  subjects: string[];
  password: string;
  role: string;
}

const Users = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState<NewTeacher>({
    name: '',
    email: '',
    phone: '',
    schoolId: '',
    subjects: [],
    password: '',
    role: '',
  });
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    schoolId: '',
    grade: '',
    guardianName: '',
    dateOfBirth: '',
  });

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      
      try {
        // Fetch schools first
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('schools')
          .select('id, name');
        
        if (schoolsError) {
          throw schoolsError;
        }
        
        const formattedSchools = schoolsData.map(school => ({
          id: school.id,
          name: school.name
        }));
        
        setSchools(formattedSchools);
        
        // Fetch teachers (users with role 'teacher')
        const { data: teachersData, error: teachersError } = await supabase
          .from('users')
          .select(`
            id, 
            name, 
            role,
            school_id,
            tenant_id,
            school:schools!users_school_id_fkey(name)
          `)
          .in('role', ['teacher', 'staff', 'school_admin'])
          .eq('tenant_id', user?.tenantId) as { data: TeacherData[] | null, error: any };
        
        if (teachersError) {
          throw teachersError;
        }

        // Get list of user IDs
        const teacherIds = (teachersData || []).map(teacher => teacher.id);

        // Fetch emails using the database function
        const { data: emailData, error: emailError } = await supabase
          .rpc('get_user_emails', { user_ids: teacherIds });

        if (emailError) {
          console.error('Error fetching emails:', emailError);
        }

        // Create a map of user IDs to emails
        const emailMap = new Map(emailData?.map(user => [user.id, user.email]) || []);
        
        // Fetch students (users with role 'student')
        const { data: studentsData, error: studentsError } = await supabase
          .from('users')
          .select(`
            id, 
            name, 
            role,
            school_id,
            tenant_id,
            date_of_birth,
            school:schools!users_school_id_fkey(name)
          `)
          .eq('role', 'student') as { data: StudentData[] | null, error: any };
        
        if (studentsError) {
          throw studentsError;
        }
        
        // Get list of student IDs
        const studentIds = (studentsData || []).map(student => student.id);

        // Fetch emails for students using the database function
        const { data: studentEmailData, error: studentEmailError } = await supabase
          .rpc('get_user_emails', { user_ids: studentIds });

        if (studentEmailError) {
          console.error('Error fetching student emails:', studentEmailError);
        }

        // Create a map of student IDs to emails
        const studentEmailMap = new Map(studentEmailData?.map(user => [user.id, user.email]) || []);
        
        // Format teachers data
        const formattedTeachers = (teachersData || []).map(teacher => ({
          id: teacher.id,
          name: teacher.name || 'No Name',
          email: emailMap.get(teacher.id) as string || 'Not provided',
          phone: 'Not provided',
          role: teacher.role,
          schoolId: teacher.school_id || '',
          schoolName: teacher.school?.name || 'No School',
          subjects: [],
        }));
        
        // Format students data
        const formattedStudents = (studentsData || []).map(student => ({
          id: student.id,
          name: student.name || 'No Name',
          email: studentEmailMap.get(student.id) as string || 'Not provided',
          phone: 'Not provided',
          role: student.role,
          schoolId: student.school_id || '',
          schoolName: student.school?.name || 'No School',
          grade: 'Not specified',
          guardianName: 'Not specified',
          dateOfBirth: student.date_of_birth || '',
        }));
        
        setTeachers(formattedTeachers);
        setStudents(formattedStudents);

      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

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
  const handleAddTeacher = async () => {
    try {
      console.log('Adding teacher:', newTeacher);
      
      // Form validation
      if (!newTeacher.name || !newTeacher.email || !newTeacher.schoolId || !newTeacher.role) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Get school name for display
      const school = schools.find(s => s.id === newTeacher.schoolId);
      const schoolName = school ? school.name : 'Unknown School';
      
      console.log('Creating user with tenant_id:', user?.tenantId);
      
      // Use the standard signup method instead of admin.createUser
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newTeacher.email,
        password: newTeacher.password,
        options: {
          data: {
            name: newTeacher.name,
            role: newTeacher.role
          }
        }
      });
      
      if (authError) {
        console.error('Error creating auth user:', authError);
        throw new Error(`Failed to create auth user: ${authError.message}`);
      }
      
      if (!authData.user) {
        throw new Error('Failed to create auth user, no user returned');
      }
      
      console.log('Auth user created:', authData.user);
      const userId = authData.user.id;
      
      // Now insert into public.users table with the same ID
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: userId,
          name: newTeacher.name,
          role: newTeacher.role,
          school_id: newTeacher.schoolId,
          tenant_id: user?.tenantId
        }])
        .select();
      
      if (error) {
        console.error('Supabase error adding teacher:', error);
        throw error;
      }
      
      console.log('Teacher added successfully:', data);
      
      if (data && data[0]) {
        // Add new teacher to state
        const newTeacherData = {
          id: data[0].id,
          name: newTeacher.name,
          email: newTeacher.email,
          phone: newTeacher.phone || 'Not provided',
          role: newTeacher.role,
          schoolId: newTeacher.schoolId,
          schoolName: schoolName,
          subjects: [],
        };
        
        setTeachers([...teachers, newTeacherData]);
        setNewTeacher({
          name: '',
          email: '',
          phone: '',
          schoolId: '',
          subjects: [],
          password: '',
          role: '',
        });
        setIsAddDialogOpen(false);
        toast.success('Teacher added successfully');
      }
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      toast.error(`Failed to add teacher: ${error.message || 'Unknown error'}`);
    }
  };

  // Add new student
  const handleAddStudent = async () => {
    try {
      // Form validation
      if (!newStudent.name || !newStudent.email || !newStudent.schoolId) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Get school name for display
      const school = schools.find(s => s.id === newStudent.schoolId);
      const schoolName = school ? school.name : '';
      
      // Use the standard signup method instead of admin.createUser
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStudent.email,
        password: 'Password123', // This is a temporary password, should be changed on first login
        options: {
          data: {
            name: newStudent.name,
            role: 'student'
          }
        }
      });
      
      if (authError) throw new Error(`Failed to create auth user: ${authError.message}`);
      if (!authData.user) throw new Error('Failed to create auth user, no user returned');
      
      const userId = authData.user.id;
      
      // Now insert into public.users table with the same ID
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          name: newStudent.name,
          role: 'student',
          school_id: newStudent.schoolId,
          tenant_id: user?.tenantId,
          date_of_birth: newStudent.dateOfBirth || null,
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        // Add new student to state
        const newStudentData = {
          id: data[0].id,
          name: newStudent.name,
          email: newStudent.email,
          phone: newStudent.phone,
          role: 'student',
          schoolId: newStudent.schoolId,
          schoolName: schoolName,
          grade: newStudent.grade,
          guardianName: newStudent.guardianName,
          dateOfBirth: newStudent.dateOfBirth,
        };
        
        setStudents([...students, newStudentData]);
        setNewStudent({
          name: '',
          email: '',
          phone: '',
          schoolId: '',
          grade: '',
          guardianName: '',
          dateOfBirth: '',
        });
        setIsAddDialogOpen(false);
        toast.success('Student added successfully');
      }
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast.error(`Failed to add student: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <AddUserDialog
          activeTab={activeTab}
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          newTeacher={newTeacher}
          setNewTeacher={setNewTeacher}
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          handleAddTeacher={handleAddTeacher}
          handleAddStudent={handleAddStudent}
          schools={schools}
          // subjects={SUBJECTS}
          grades={GRADES}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="teachers">Staff</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <TabsContent value="teachers">
              <TeachersList teachers={filteredTeachers} />
            </TabsContent>
            
            <TabsContent value="students">
              <StudentsList students={filteredStudents} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Users;
