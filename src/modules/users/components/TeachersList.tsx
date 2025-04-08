
import TeacherCard from './TeacherCard';
import EmptyState from './EmptyState';

interface TeachersListProps {
  teachers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    schoolId: string;
    schoolName: string;
    subjects: string[];
  }[];
}

const TeachersList = ({ teachers }: TeachersListProps) => {
  if (teachers.length === 0) {
    return <EmptyState type="teachers" />;
  }
  
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {teachers.map((teacher) => (
        <TeacherCard key={teacher.id} teacher={teacher} />
      ))}
    </div>
  );
};

export default TeachersList;
