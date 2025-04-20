
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentTransport, Route, Stop } from "../../types/transport.types";

interface StudentTransportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<StudentTransport>) => void;
  routes: Route[];
  studentTransport?: StudentTransport;
  stops: Stop[];
}

export const StudentTransportDialog = ({
  open,
  onOpenChange,
  onSubmit,
  routes,
  studentTransport,
  stops,
}: StudentTransportDialogProps) => {
  const [selectedRoute, setSelectedRoute] = useState(studentTransport?.route_id || "");
  const [selectedStop, setSelectedStop] = useState(studentTransport?.stop_id || "");
  const [type, setType] = useState<"pickup" | "drop" | "both">(studentTransport?.type || "both");

  const filteredStops = stops.filter((stop) => stop.route_id === selectedRoute);

  const handleSubmit = () => {
    onSubmit({
      route_id: selectedRoute,
      stop_id: selectedStop,
      type,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {studentTransport ? "Edit Transport Assignment" : "New Transport Assignment"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Route</Label>
            <Select
              value={selectedRoute}
              onValueChange={(value) => {
                setSelectedRoute(value);
                setSelectedStop("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a route" />
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

          <div>
            <Label>Stop</Label>
            <Select value={selectedStop} onValueChange={setSelectedStop}>
              <SelectTrigger>
                <SelectValue placeholder="Select a stop" />
              </SelectTrigger>
              <SelectContent>
                {filteredStops.map((stop) => (
                  <SelectItem key={stop.id} value={stop.id}>
                    {stop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Transport Type</Label>
            <Select
              value={type}
              onValueChange={(value: "pickup" | "drop" | "both") => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup Only</SelectItem>
                <SelectItem value="drop">Drop Only</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {studentTransport ? "Update" : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
