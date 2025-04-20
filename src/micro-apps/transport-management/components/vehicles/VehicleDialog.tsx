
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Vehicle } from "../../types/transport.types";
import { useEffect } from "react";

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Vehicle) => void;
  vehicle?: Vehicle | null;
}

export const VehicleDialog = ({
  open,
  onOpenChange,
  onSubmit,
  vehicle,
}: VehicleDialogProps) => {
  const form = useForm<Vehicle>({
    defaultValues: {
      vehicleNumber: "",
      model: "",
      capacity: 0,
      status: "active",
      school_id: "1",
      id: ""  // Add an empty id for new vehicles
    },
  });

  useEffect(() => {
    if (vehicle) {
      form.reset(vehicle);
    } else {
      form.reset({
        vehicleNumber: "",
        model: "",
        capacity: 0,
        status: "active",
        school_id: "1",
        id: ""
      });
    }
  }, [vehicle, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vehicle ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vehicle number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vehicle model" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity (seats)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter seating capacity"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{vehicle ? "Save" : "Add"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
