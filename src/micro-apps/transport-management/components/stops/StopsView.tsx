
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StopsTable } from "./StopsTable";
import { StopsDialog } from "./StopsDialog";
import { Route, Stop } from "../../types/transport.types";

interface StopsViewProps {
  route: Route;
  stops: Stop[];
  onUpdateStops: (stops: Stop[]) => void;
}

export const StopsView = ({ route, stops, onUpdateStops }: StopsViewProps) => {
  const [open, setOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<Stop | null>(null);

  const handleAddStop = (stop: Stop) => {
    const newStop: Stop = {
      ...stop,
      id: String(stops.length + 1),
      route_id: route.id,
    };
    onUpdateStops([...stops, newStop]);
    setOpen(false);
  };

  const handleEditStop = (stop: Stop) => {
    onUpdateStops(stops.map((s) => (s.id === stop.id ? stop : s)));
    setEditingStop(null);
    setOpen(false);
  };

  const handleDeleteStop = (id: string) => {
    onUpdateStops(stops.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stops for {route.name}</h3>
        <Button onClick={() => {
          setEditingStop(null);
          setOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stop
        </Button>
      </div>

      <StopsTable
        stops={stops}
        onEdit={(stop) => {
          setEditingStop(stop);
          setOpen(true);
        }}
        onDelete={handleDeleteStop}
      />

      <StopsDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={editingStop ? handleEditStop : handleAddStop}
        stop={editingStop}
        routeId={route.id}
      />
    </div>
  );
};
