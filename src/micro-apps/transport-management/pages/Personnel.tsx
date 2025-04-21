
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonnelTable } from "../components/personnel/PersonnelTable";
import { PersonnelDialog } from "../components/personnel/PersonnelDialog";
import { Personnel } from "../types/transport.types";
import { mockPersonnel, mockRoutes } from "../mock/mockData";

const Personnel = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>(mockPersonnel);
  const [open, setOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);

  const handleAdd = (person: Personnel) => {
    const newPerson = {
      ...person,
      id: String(personnel.length + 1),
    };
    setPersonnel([...personnel, newPerson]);
    setOpen(false);
  };

  const handleEdit = (person: Personnel) => {
    setPersonnel(personnel.map((p) => 
      p.id === person.id ? person : p
    ));
    setEditingPersonnel(null);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    setPersonnel(personnel.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Drivers & Conductors</h2>
        <Button onClick={() => {
          setEditingPersonnel(null);
          setOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Personnel
        </Button>
      </div>

      <PersonnelTable
        personnel={personnel}
        routes={mockRoutes}
        onEdit={(person) => {
          setEditingPersonnel(person);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <PersonnelDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={editingPersonnel ? handleEdit : handleAdd}
        personnel={editingPersonnel}
        routes={mockRoutes}
      />
    </div>
  );
};

export default Personnel;
