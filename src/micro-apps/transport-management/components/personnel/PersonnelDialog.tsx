
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Personnel, Route } from "../../types/transport.types";

interface PersonnelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Personnel>) => void;
  personnel?: Personnel;
  routes: Route[];
}

export const PersonnelDialog = ({
  open,
  onOpenChange,
  onSubmit,
  personnel,
  routes,
}: PersonnelDialogProps) => {
  const [formData, setFormData] = useState({
    name: personnel?.name || "",
    type: personnel?.type || "driver",
    contact: personnel?.contact || "",
    license_number: personnel?.license_number || "",
    route_id: personnel?.route_id || "",
    status: personnel?.status || "active",
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {personnel ? "Edit Personnel" : "Add Personnel"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
            />
          </div>

          <div>
            <Label>Type</Label>
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

          <div>
            <Label>Contact</Label>
            <Input
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="Enter contact number"
            />
          </div>

          {formData.type === "driver" && (
            <div>
              <Label>License Number</Label>
              <Input
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                placeholder="Enter license number"
              />
            </div>
          )}

          <div>
            <Label>Route Assignment</Label>
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

          <div>
            <Label>Status</Label>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {personnel ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
