
type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  schoolId: string;
  schoolName: string;
  subjects: string[];
};

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  schoolId: string;
  schoolName: string;
  grade: string;
  guardianName: string;
  dateOfBirth?: string;
};

export const useUserSearch = (
  searchTerm: string, 
  teachers: Teacher[], 
  students: Student[]
) => {
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

  return { filteredTeachers, filteredStudents };
};
