import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Personnel, Route } from "../../types/transport.types";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonnelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (personnel: Personnel) => void;
  personnel?: Personnel | null;
  routes: Route[];
}

export const PersonnelDialog = ({
  open,
  onOpenChange,
  onSubmit,
  personnel,
  routes,
}: PersonnelDialogProps) => {
  const [formData, setFormData] = useState<Personnel>({
    id: "",
    name: "",
    type: "driver",
    contact: "",
    license_number: "",
    school_id: "1",
    route_id: "",
    status: "active",
  });

  useEffect(() => {
    if (personnel) {
      setFormData(personnel);
    } else {
      setFormData({
        id: "",
        name: "",
        type: "driver",
        contact: "",
        license_number: "",
        school_id: "1",
        route_id: "",
        status: "active",
      });
    }
  }, [personnel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {personnel ? "Edit" : "Add"} Driver/Conductor
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as "driver" | "conductor" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="conductor">Conductor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                placeholder="Contact Number"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
              />
            </div>
            {formData.type === "driver" && (
              <div className="flex flex-col space-y-1.5">
                <Input
                  placeholder="License Number"
                  value={formData.license_number || ""}
                  onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="flex flex-col space-y-1.5">
              <Select
                value={formData.route_id}
                onValueChange={(value) => setFormData({ ...formData, route_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign to route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Not Assigned</SelectItem>
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
            <Button type="submit">{personnel ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
