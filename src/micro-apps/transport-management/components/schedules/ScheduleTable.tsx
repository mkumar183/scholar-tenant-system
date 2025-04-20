
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Schedule, Route, Vehicle } from "../../types/transport.types";
import { Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

// Create a simple capitalize helper function
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

interface ScheduleTableProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
  routes: Route[];
  vehicles: Vehicle[];
}

export const ScheduleTable = ({
  schedules,
  onEdit,
  onDelete,
  routes,
  vehicles,
}: ScheduleTableProps) => {
  // Helper function to get route name by ID
  const getRouteName = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    return route ? route.name : "Unknown Route";
  };

  // Helper function to get vehicle name by ID
  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? vehicle.registration_number : "Unknown Vehicle";
  };

  return (
    <div className="border rounded-md">
      {schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center p-4">
          <p className="text-muted-foreground mb-2">No schedules found</p>
          <p className="text-sm text-muted-foreground">
            Create a new schedule to get started
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Day Type</TableHead>
              <TableHead>Departure Time</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{getRouteName(schedule.route_id)}</TableCell>
                <TableCell>{getVehicleName(schedule.vehicle_id)}</TableCell>
                <TableCell>{capitalize(schedule.day_type)}</TableCell>
                <TableCell>{schedule.departure_time}</TableCell>
                <TableCell>{schedule.arrival_time}</TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      schedule.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    )}
                  >
                    {capitalize(schedule.status)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(schedule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(schedule.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
