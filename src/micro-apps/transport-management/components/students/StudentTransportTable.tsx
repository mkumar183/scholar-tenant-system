
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { StudentTransport, Route, Stop } from "../../types/transport.types";

interface StudentTransportTableProps {
  assignments: StudentTransport[];
  routes: Route[];
  stops: Stop[];
  onEdit: (assignment: StudentTransport) => void;
  onDelete: (id: string) => void;
}

export const StudentTransportTable = ({
  assignments,
  routes,
  stops,
  onEdit,
  onDelete,
}: StudentTransportTableProps) => {
  const getRouteName = (routeId: string) => {
    return routes.find(r => r.id === routeId)?.name || 'Unknown Route';
  };

  const getStopName = (stopId: string) => {
    return stops.find(s => s.id === stopId)?.name || 'Unknown Stop';
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Stop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>{assignment.student_id}</TableCell>
              <TableCell>{getRouteName(assignment.route_id)}</TableCell>
              <TableCell>{getStopName(assignment.stop_id)}</TableCell>
              <TableCell className="capitalize">{assignment.type}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(assignment)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(assignment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
