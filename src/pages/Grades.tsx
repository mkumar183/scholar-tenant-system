
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useGrades } from '@/hooks/useGrades';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GRADE_LEVELS = [
  { name: 'Nursery', level: 0 },
  { name: 'LKG', level: 1 },
  { name: 'UKG', level: 2 },
  { name: '1', level: 3 },
  { name: '2', level: 4 },
  { name: '3', level: 5 },
  { name: '4', level: 6 },
  { name: '5', level: 7 },
  { name: '6', level: 8 },
  { name: '7', level: 9 },
  { name: '8', level: 10 },
  { name: '9', level: 11 },
  { name: '10', level: 12 },
  { name: '11', level: 13 },
  { name: '12', level: 14 },
];

const Grades = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [newGrade, setNewGrade] = useState({
    name: '',
    level: 0,
  });

  // Only tenant admins can access this page
  if (user?.role !== 'tenant_admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Only tenant administrators can access this page.</p>
        </div>
      </div>
    );
  }

  const { grades, isLoading, addGrade, updateGrade } = useGrades(user.tenantId);

  const handleAddOrUpdateGrade = async () => {
    if (!user?.tenantId) return;
    
    let success;
    if (isEditMode && selectedGrade) {
      success = await updateGrade(selectedGrade.id, {
        ...newGrade,
        tenantId: user.tenantId,
      });
    } else {
      success = await addGrade({
        ...newGrade,
        tenantId: user.tenantId,
      });
    }

    if (success) {
      setNewGrade({ name: '', level: 0 });
      setIsEditMode(false);
      setSelectedGrade(null);
      setIsDialogOpen(false);
    }
  };

  const handleEditClick = (grade: Grade) => {
    setSelectedGrade(grade);
    setNewGrade({
      name: grade.name,
      level: grade.level,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading grades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Grades</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditMode(false);
              setSelectedGrade(null);
              setNewGrade({ name: '', level: 0 });
            }}>
              Add Grade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Grade Name</label>
                <Input
                  value={newGrade.name}
                  onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
                  placeholder="Enter grade name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Grade Level</label>
                <Select
                  value={newGrade.level.toString()}
                  onValueChange={(value) => setNewGrade({ ...newGrade, level: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_LEVELS.map((grade) => (
                      <SelectItem key={grade.level} value={grade.level.toString()}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddOrUpdateGrade}>
                {isEditMode ? 'Update Grade' : 'Add Grade'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell>{grade.name}</TableCell>
              <TableCell>{grade.level}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(grade)}
                  >
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Grades;

