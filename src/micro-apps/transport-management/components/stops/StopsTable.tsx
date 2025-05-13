
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
import { Stop } from "../../types/transport.types";

interface StopsTableProps {
  stops: Stop[];
  onEdit: (stop: Stop) => void;
  onDelete: (id: string) => void;
}

export const StopsTable = ({ stops, onEdit, onDelete }: StopsTableProps) => {
  const sortedStops = [...stops].sort((a, b) => a.order - b.order);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Estimated Arrival</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStops.map((stop) => (
            <TableRow key={stop.id}>
              <TableCell>{stop.order}</TableCell>
              <TableCell>{stop.name}</TableCell>
              <TableCell>{stop.estimated_arrival_time}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(stop)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(stop.id)}
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
