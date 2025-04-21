
import { Car, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Vehicle } from "../../types/transport.types";

interface VehiclesTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export const VehiclesTable = ({ vehicles, onEdit, onDelete }: VehiclesTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle Number</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                {vehicle.vehicleNumber}
              </TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.capacity} seats</TableCell>
              <TableCell className="capitalize">{vehicle.status}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(vehicle)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(vehicle.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
