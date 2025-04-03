
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, School, Users, Search, BookOpen, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const MOCK_SCHOOLS = [
  {
    id: 'school-1',
    name: 'Lincoln High School',
    address: '123 Education St, Metropolis',
    tenantId: 'tenant-1',
    tenantName: 'City School District',
    type: 'High School',
    teacherCount: 45,
    studentCount: 850,
  },
  {
    id: 'school-2',
    name: 'Washington Middle School',
    address: '456 Learning Ave, Metropolis',
    tenantId: 'tenant-1',
    tenantName: 'City School District',
    type: 'Middle School',
    teacherCount: 32,
    studentCount: 560,
  },
  {
    id: 'school-3',
    name: 'Roosevelt Elementary',
    address: '789 Knowledge Rd, Metropolis',
    tenantId: 'tenant-1',
    tenantName: 'City School District',
    type: 'Elementary School',
    teacherCount: 28,
    studentCount: 420,
  },
  {
    id: 'school-4',
    name: 'Edison Academy',
    address: '321 Innovation Blvd, Techville',
    tenantId: 'tenant-3',
    tenantName: 'Private Academy Group',
    type: 'Private School',
    teacherCount: 22,
    studentCount: 300,
  },
];

const MOCK_TENANTS = [
  { id: 'tenant-1', name: 'City School District' },
  { id: 'tenant-2', name: 'County Education Board' },
  { id: 'tenant-3', name: 'Private Academy Group' },
  { id: 'tenant-4', name: 'Charter Schools Alliance' },
];

const SCHOOL_TYPES = [
  'Elementary School',
  'Middle School',
  'High School',
  'Private School',
  'Charter School',
  'Alternative School',
];

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    address: '',
    tenantId: '',
    type: '',
  });

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSchool = () => {
    const id = `school-${schools.length + 1}`;
    const tenantName = MOCK_TENANTS.find(t => t.id === newSchool.tenantId)?.name || '';
    
    const newSchoolData = {
      ...newSchool,
      id,
      tenantName,
      teacherCount: 0,
      studentCount: 0,
    };
    
    setSchools([...schools, newSchoolData]);
    setNewSchool({
      name: '',
      address: '',
      tenantId: '',
      type: '',
    });
    setIsAddDialogOpen(false);
    toast.success('School added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add School
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New School</DialogTitle>
              <DialogDescription>
                Register a new school in the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="school-name">School Name</Label>
                <Input
                  id="school-name"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="school-address">Address</Label>
                <Input
                  id="school-address"
                  value={newSchool.address}
                  onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="school-tenant">Tenant</Label>
                <Select 
                  value={newSchool.tenantId} 
                  onValueChange={(value) => setNewSchool({...newSchool, tenantId: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_TENANTS.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="school-type">School Type</Label>
                <Select 
                  value={newSchool.type} 
                  onValueChange={(value) => setNewSchool({...newSchool, type: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOL_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSchool}>Create School</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">{school.name}</CardTitle>
              <CardDescription className="flex items-center text-xs">
                <MapPin className="mr-1 h-3 w-3" />
                {school.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="text-xs text-muted-foreground">Tenant</div>
                <div className="text-sm font-medium">{school.tenantName}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-muted-foreground">Type</div>
                <div className="text-sm font-medium">{school.type}</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm">
                  <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{school.teacherCount} Teachers</span>
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{school.studentCount} Students</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm">View</Button>
                <Button size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <School className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No schools found</h3>
          <p className="text-muted-foreground">Try adjusting your search or add a new school.</p>
        </div>
      )}
    </div>
  );
};

export default Schools;
