
import { Mail, Phone, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudentCardProps {
  student: {
    id: string;
    name: string;
    email: string;
    phone: string;
    schoolName: string;
    grade: string;
    guardianName: string;
  };
}

const StudentCard = ({ student }: StudentCardProps) => {
  return (
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
  );
};

export default StudentCard;
