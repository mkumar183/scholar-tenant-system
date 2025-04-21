
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Schedule, Route, Vehicle } from "../../types/transport.types";
import { useState, useEffect } from "react";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (schedule: Schedule) => void;
  schedule?: Schedule | null;
  routes: Route[];
  vehicles: Vehicle[];
}

export const ScheduleDialog = ({
  open,
  onOpenChange,
  onSubmit,
  schedule,
  routes,
  vehicles,
}: ScheduleDialogProps) => {
  const [formData, setFormData] = useState<Schedule>({
    id: "",
    route_id: "",
    vehicle_id: "",
    day_type: "weekday",
    departure_time: "07:30",
    arrival_time: "08:30",
    status: "active",
    school_id: "1",
  });

  useEffect(() => {
    if (schedule) {
      setFormData(schedule);
    } else {
      setFormData({
        id: "",
        route_id: routes.length > 0 ? routes[0].id : "",
        vehicle_id: vehicles.length > 0 ? vehicles[0].id : "",
        day_type: "weekday",
        departure_time: "07:30",
        arrival_time: "08:30",
        status: "active",
        school_id: "1",
      });
    }
  }, [schedule, routes, vehicles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {schedule ? "Edit" : "Add"} Schedule
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Select
                value={formData.route_id}
                onValueChange={(value) => setFormData({ ...formData, route_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Select
                value={formData.vehicle_id}
                onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.registration_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Select
                value={formData.day_type}
                onValueChange={(value) => setFormData({ ...formData, day_type: value as "weekday" | "weekend" | "holiday" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekday">Weekday</SelectItem>
                  <SelectItem value="weekend">Weekend</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                type="time"
                value={formData.departure_time}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                type="time"
                value={formData.arrival_time}
                onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{schedule ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
