
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentTransportDialog } from "../components/assignments/StudentTransportDialog";
import { TransportNav } from "../components/TransportNav";
import { mockRoutes, mockStops, mockStudentTransport } from "../mock/mockData";
import { StudentTransport } from "../types/transport.types";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

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
    <div className="container mx-auto p-6">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Stop</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentTransports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No student transport assignments found
                  </TableCell>
                </TableRow>
              ) : (
                studentTransports.map((transport) => (
                  <TableRow key={transport.id}>
                    <TableCell>{transport.student_id}</TableCell>
                    <TableCell>
                      {mockRoutes.find((r) => r.id === transport.route_id)?.name || 'Unknown Route'}
                    </TableCell>
                    <TableCell>
                      {mockStops.find((s) => s.id === transport.stop_id)?.name || 'Unknown Stop'}
                    </TableCell>
                    <TableCell className="capitalize">{transport.type}</TableCell>
                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
