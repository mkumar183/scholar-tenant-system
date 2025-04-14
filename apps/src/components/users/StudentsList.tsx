
import StudentCard from './StudentCard';
import EmptyState from './EmptyState';

interface StudentsListProps {
  students: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    schoolId: string;
    schoolName: string;
    grade: string;
    guardianName: string;
  }[];
}

const StudentsList = ({ students }: StudentsListProps) => {
  if (students.length === 0) {
    return <EmptyState type="students" />;
  }
  
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
};

export default StudentsList;
