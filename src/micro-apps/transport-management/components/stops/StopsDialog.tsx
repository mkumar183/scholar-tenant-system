
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
import { Stop } from "../../types/transport.types";
import { useEffect } from "react";

interface StopsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Stop) => void;
  stop?: Stop | null;
  routeId: string;
}

export const StopsDialog = ({
  open,
  onOpenChange,
  onSubmit,
  stop,
  routeId,
}: StopsDialogProps) => {
  const form = useForm<Stop>({
    defaultValues: {
      name: "",
      order: 1,
      estimated_arrival_time: "07:00",
      route_id: routeId,
      id: "",
    },
  });

  useEffect(() => {
    if (stop) {
      form.reset(stop);
    } else {
      form.reset({
        name: "",
        order: 1,
        estimated_arrival_time: "07:00",
        route_id: routeId,
        id: "",
      });
    }
  }, [stop, routeId, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stop ? "Edit Stop" : "Add Stop"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter stop name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter stop order" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimated_arrival_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Arrival Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
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
              <Button type="submit">{stop ? "Save" : "Add"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
