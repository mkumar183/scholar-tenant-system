
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonnelDialog } from "../components/personnel/PersonnelDialog";
import { TransportNav } from "../components/TransportNav";
import { mockPersonnel, mockRoutes } from "../mock/mockData";
import { Personnel } from "../types/transport.types";
import { Badge } from "@/components/ui/badge";

const Personnel = () => {
  const [open, setOpen] = useState(false);
  const [personnel, setPersonnel] = useState<Personnel[]>(mockPersonnel);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);

  const handleAddPersonnel = (data: Partial<Personnel>) => {
    const newPersonnel: Personnel = {
      id: String(personnel.length + 1),
      school_id: "1",
      ...data as Personnel
    };
    setPersonnel([...personnel, newPersonnel]);
    setOpen(false);
  };

  const handleEditPersonnel = (data: Partial<Personnel>) => {
    if (!editingPersonnel) return;
    
    setPersonnel(personnel.map((p) =>
      p.id === editingPersonnel.id
        ? { ...p, ...data }
        : p
    ));
    setEditingPersonnel(null);
    setOpen(false);
  };

  return (
    <div>
      <TransportNav />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Personnel Management</h2>
          <Button onClick={() => {
            setEditingPersonnel(null);
            setOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Personnel
          </Button>
        </div>

        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">License</th>
                <th className="p-4 text-left">Route</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((person) => (
                <tr key={person.id} className="border-b">
                  <td className="p-4">{person.name}</td>
                  <td className="p-4 capitalize">{person.type}</td>
                  <td className="p-4">{person.contact}</td>
                  <td className="p-4">{person.license_number || "-"}</td>
                  <td className="p-4">
                    {mockRoutes.find((r) => r.id === person.route_id)?.name || "-"}
                  </td>
                  <td className="p-4">
                    <Badge variant={person.status === "active" ? "default" : "secondary"}>
                      {person.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPersonnel(person);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PersonnelDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={editingPersonnel ? handleEditPersonnel : handleAddPersonnel}
        personnel={editingPersonnel || undefined}
        routes={mockRoutes}
      />
    </div>
  );
};

export default Personnel;
