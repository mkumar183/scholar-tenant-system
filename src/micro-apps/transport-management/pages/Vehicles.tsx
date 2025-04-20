
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehiclesTable } from "../components/vehicles/VehiclesTable";
import { VehicleDialog } from "../components/vehicles/VehicleDialog";
import { Vehicle } from "../types/transport.types";
import { mockVehicles } from "../mock/mockData";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [open, setOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleAddVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => [...prev, { ...vehicle, id: String(prev.length + 1) }]);
    setOpen(false);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicle.id ? vehicle : v))
    );
    setEditingVehicle(null);
    setOpen(false);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vehicles</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <VehiclesTable
        vehicles={vehicles}
        onEdit={(vehicle) => {
          setEditingVehicle(vehicle);
          setOpen(true);
        }}
        onDelete={handleDeleteVehicle}
      />

      <VehicleDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
        vehicle={editingVehicle}
      />
    </div>
  );
};

export default Vehicles;
