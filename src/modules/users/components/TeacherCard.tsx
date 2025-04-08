
import { Mail, Phone, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeacherCardProps {
  teacher: {
    id: string;
    name: string;
    email: string;
    phone: string;
    schoolName: string;
    subjects: string[];
  };
}

const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
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
  );
};

export default TeacherCard;
