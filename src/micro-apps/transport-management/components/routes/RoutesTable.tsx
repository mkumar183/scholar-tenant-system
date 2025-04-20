
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin } from "lucide-react";
import { Route } from "../../types/transport.types";

interface RoutesTableProps {
  routes: Route[];
  onEdit: (route: Route) => void;
  onDelete: (id: string) => void;
  onViewStops: (route: Route) => void;
}

export const RoutesTable = ({ routes, onEdit, onDelete, onViewStops }: RoutesTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.id}>
              <TableCell>{route.name}</TableCell>
              <TableCell>{route.description}</TableCell>
              <TableCell>{route.vehicle_id || "Not assigned"}</TableCell>
              <TableCell>{route.status}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewStops(route)}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(route)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(route.id)}
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
