
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScheduleTable } from "../components/schedules/ScheduleTable";
import { ScheduleDialog } from "../components/schedules/ScheduleDialog";
import { Schedule, Route, Vehicle } from "../types/transport.types";
import { mockRoutes, mockVehicles, mockSchedules } from "../mock/mockData";
import { Plus } from "lucide-react";

const Schedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [routes] = useState<Route[]>(mockRoutes);
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const handleCreateSchedule = (schedule: Schedule) => {
    // Generate a unique ID for the new schedule
    const newSchedule = {
      ...schedule,
      id: `schedule-${Date.now()}`,
    };
    setSchedules([...schedules, newSchedule]);
    setIsDialogOpen(false);
  };

  const handleUpdateSchedule = (updatedSchedule: Schedule) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule
      )
    );
    setIsDialogOpen(false);
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const openCreateDialog = () => {
    setSelectedSchedule(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Transport Schedules</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      <ScheduleTable
        schedules={schedules}
        onEdit={openEditDialog}
        onDelete={handleDeleteSchedule}
        routes={routes}
        vehicles={vehicles}
      />

      <ScheduleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={selectedSchedule ? handleUpdateSchedule : handleCreateSchedule}
        schedule={selectedSchedule}
        routes={routes}
        vehicles={vehicles}
      />
    </div>
  );
};

export default Schedules;
