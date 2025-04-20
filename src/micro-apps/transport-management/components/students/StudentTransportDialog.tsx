
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StudentTransport, Route, Stop } from "../../types/transport.types";
import { useEffect } from "react";

interface StudentTransportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StudentTransport) => void;
  assignment?: StudentTransport | null;
  routes: Route[];
  stops: Stop[];
}

export const StudentTransportDialog = ({
  open,
  onOpenChange,
  onSubmit,
  assignment,
  routes,
  stops,
}: StudentTransportDialogProps) => {
  const form = useForm<StudentTransport>({
    defaultValues: {
      student_id: "",
      route_id: "",
      stop_id: "",
      type: "both",
      id: "",
    },
  });

  const selectedRouteId = form.watch("route_id");
  const routeStops = stops.filter(stop => stop.route_id === selectedRouteId);

  useEffect(() => {
    if (assignment) {
      form.reset(assignment);
    } else {
      form.reset({
        student_id: "",
        route_id: "",
        stop_id: "",
        type: "both",
        id: "",
      });
    }
  }, [assignment, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{assignment ? "Edit Assignment" : "Add Assignment"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter student ID" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="route_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a route" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stop_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedRouteId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a stop" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {routeStops.map((stop) => (
                        <SelectItem key={stop.id} value={stop.id}>
                          {stop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="drop">Drop</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type="submit">{assignment ? "Save" : "Add"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
