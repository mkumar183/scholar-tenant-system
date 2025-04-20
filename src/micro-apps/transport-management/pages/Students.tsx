
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentTransportDialog } from "../components/assignments/StudentTransportDialog";
import { TransportNav } from "../components/TransportNav";
import { mockRoutes, mockStops, mockStudentTransport } from "../mock/mockData";
import { StudentTransport } from "../types/transport.types";

const Students = () => {
  const [open, setOpen] = useState(false);
  const [studentTransports, setStudentTransports] = useState<StudentTransport[]>(mockStudentTransport);
  const [editingTransport, setEditingTransport] = useState<StudentTransport | null>(null);

  const handleAddTransport = (data: Partial<StudentTransport>) => {
    const newTransport: StudentTransport = {
      id: String(studentTransports.length + 1),
      student_id: "1", // In a real app, this would be selected from a list
      ...data as StudentTransport
    };
    setStudentTransports([...studentTransports, newTransport]);
    setOpen(false);
  };

  const handleEditTransport = (data: Partial<StudentTransport>) => {
    if (!editingTransport) return;
    
    setStudentTransports(studentTransports.map((transport) =>
      transport.id === editingTransport.id
        ? { ...transport, ...data }
        : transport
    ));
    setEditingTransport(null);
    setOpen(false);
  };

  return (
    <div>
      <TransportNav />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Student Transport Assignments</h2>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Student
          </Button>
        </div>

        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">Student ID</th>
                <th className="p-4 text-left">Route</th>
                <th className="p-4 text-left">Stop</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentTransports.map((transport) => (
                <tr key={transport.id} className="border-b">
                  <td className="p-4">{transport.student_id}</td>
                  <td className="p-4">
                    {mockRoutes.find((r) => r.id === transport.route_id)?.name}
                  </td>
                  <td className="p-4">
                    {mockStops.find((s) => s.id === transport.stop_id)?.name}
                  </td>
                  <td className="p-4 capitalize">{transport.type}</td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTransport(transport);
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

      <StudentTransportDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={editingTransport ? handleEditTransport : handleAddTransport}
        routes={mockRoutes}
        stops={mockStops}
        studentTransport={editingTransport || undefined}
      />
    </div>
  );
};

export default Students;
