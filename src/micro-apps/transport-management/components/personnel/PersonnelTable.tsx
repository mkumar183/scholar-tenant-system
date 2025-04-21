
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Personnel, Route } from "../../types/transport.types";
import { Edit, X } from "lucide-react";

interface PersonnelTableProps {
  personnel: Personnel[];
  routes: Route[];
  onEdit: (personnel: Personnel) => void;
  onDelete: (id: string) => void;
}

export const PersonnelTable = ({ personnel, routes, onEdit, onDelete }: PersonnelTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>License Number</TableHead>
          <TableHead>Assigned Route</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {personnel.map((person) => (
          <TableRow key={person.id}>
            <TableCell>{person.name}</TableCell>
            <TableCell className="capitalize">{person.type}</TableCell>
            <TableCell>{person.contact}</TableCell>
            <TableCell>{person.license_number || 'N/A'}</TableCell>
            <TableCell>
              {routes.find(route => route.id === person.route_id)?.name || 'Not Assigned'}
            </TableCell>
            <TableCell className="capitalize">{person.status}</TableCell>
            <TableCell className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(person)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(person.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
