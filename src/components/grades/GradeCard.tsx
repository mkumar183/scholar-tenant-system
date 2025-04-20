
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GradeCardProps {
  id: string;
  name: string;
  description?: string;
  studentCount?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const GradeCard = ({ 
  id, 
  name, 
  description, 
  studentCount = 0, 
  onEdit, 
  onDelete 
}: GradeCardProps) => {
  const navigate = useNavigate();

  const handleViewStudents = () => {
    navigate(`/grades/${id}/students`);
  };

  return (
    <Card hoverable className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Badge variant="outline">{name}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">
          {description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          <span>{studentCount} students</span>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={() => onDelete(id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="default" size="sm" onClick={handleViewStudents}>
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GradeCard;
