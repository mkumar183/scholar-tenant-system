import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, School as SchoolIcon, Users, Search, BookOpen, MapPin, Loader2 } from 'lucide-react';
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
import { useSchoolsData } from '@/hooks/useSchoolsData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// School types for dropdown
const SCHOOL_TYPES = [
  'Elementary School',
  'Middle School',
  'High School',
  'Private School',
  'Charter School',
  'Alternative School',
];

const Schools = () => {
  const { user } = useAuth();
  const { schools, isLoading } = useSchoolsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    address: '',
    type: '',
  });

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.address && school.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (school.type && school.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddSchool = async () => {
    try {
      if (!user?.tenantId) {
        toast.error('No tenant ID found');
        return;
      }

      const { data, error } = await supabase
        .from('schools')
        .insert([
          {
            name: newSchool.name,
            address: newSchool.address,
            type: newSchool.type,
            tenant_id: user.tenantId,
          }
        ])
        .select();

      if (error) throw error;

      toast.success('School added successfully');
      setIsAddDialogOpen(false);
      
      // Reset form
      setNewSchool({
        name: '',
        address: '',
        type: '',
      });
      
      // Refresh data - hacky but works
      window.location.reload();
    } catch (error) {
      console.error('Error adding school:', error);
      toast.error('Failed to add school');
    }
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
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchools.map((school) => (
              <Card key={school.id} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl">{school.name}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <MapPin className="mr-1 h-3 w-3" />
                    {school.address || 'No address provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground">Type</div>
                    <div className="text-sm font-medium">{school.type || 'Not specified'}</div>
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
                    <Button size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredSchools.length === 0 && (
            <div className="text-center py-12">
              <SchoolIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No schools found</h3>
              <p className="text-muted-foreground">Try adjusting your search or add a new school.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Schools;
