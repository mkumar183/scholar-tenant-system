
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentTransportTable } from "../components/students/StudentTransportTable";
import { StudentTransportDialog } from "../components/students/StudentTransportDialog";
import { StudentTransport, Route, Stop } from "../types/transport.types";
import { mockStudentTransport, mockRoutes, mockStops } from "../mock/mockData";

const Students = () => {
  const [assignments, setAssignments] = useState<StudentTransport[]>(mockStudentTransport);
  const [open, setOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<StudentTransport | null>(null);

  const handleAdd = (assignment: StudentTransport) => {
    const newAssignment = {
      ...assignment,
      id: String(assignments.length + 1),
    };
    setAssignments([...assignments, newAssignment]);
    setOpen(false);
  };

  const handleEdit = (assignment: StudentTransport) => {
    setAssignments(assignments.map((a) => 
      a.id === assignment.id ? assignment : a
    ));
    setEditingAssignment(null);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Student Transport Assignments</h2>
        <Button onClick={() => {
          setEditingAssignment(null);
          setOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </div>

      <StudentTransportTable
        assignments={assignments}
        routes={mockRoutes}
        stops={mockStops}
        onEdit={(assignment) => {
          setEditingAssignment(assignment);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <StudentTransportDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={editingAssignment ? handleEdit : handleAdd}
        assignment={editingAssignment}
        routes={mockRoutes}
        stops={mockStops}
      />
    </div>
  );
};

export default Students;
