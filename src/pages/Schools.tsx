
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { School as SchoolIcon, Users, Search, BookOpen, MapPin, Loader2 } from 'lucide-react';
import { useSchoolsData } from '@/hooks/useSchoolsData';
import { useAuth } from '@/contexts/AuthContext';
import AddSchoolDialog from '@/components/schools/AddSchoolDialog';
import { Button } from '@/components/ui/button'; // Added missing import

const Schools = () => {
  const { user } = useAuth();
  const { schools, isLoading, refreshSchools } = useSchoolsData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.address && school.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (school.type && school.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        
        {(user?.role === 'tenant_admin' || user?.role === 'school_admin') && (
          <AddSchoolDialog onSchoolAdded={refreshSchools} />
        )}
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
