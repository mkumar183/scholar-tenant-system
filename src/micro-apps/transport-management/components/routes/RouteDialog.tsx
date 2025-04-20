
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
import { Route } from "../../types/transport.types";
import { useEffect } from "react";

interface RouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Route) => void;
  route?: Route | null;
}

export const RouteDialog = ({
  open,
  onOpenChange,
  onSubmit,
  route,
}: RouteDialogProps) => {
  const form = useForm<Route>({
    defaultValues: {
      name: "",
      description: "",
      school_id: "1",
      status: "active",
      id: "",
    },
  });

  useEffect(() => {
    if (route) {
      form.reset(route);
    } else {
      form.reset({
        name: "",
        description: "",
        school_id: "1",
        status: "active",
        id: "",
      });
    }
  }, [route, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{route ? "Edit Route" : "Add Route"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter route name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter route description" {...field} />
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
              <Button type="submit">{route ? "Save" : "Add"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
