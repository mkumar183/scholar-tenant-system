
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, User, BookOpen } from 'lucide-react';

const AdminDashboard = () => (
  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Schools Managed</CardTitle>
        <School className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">4</div>
        <p className="text-xs text-muted-foreground">
          +1 from last month
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Teachers</CardTitle>
        <User className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">32</div>
        <p className="text-xs text-muted-foreground">
          +3 from last month
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Students</CardTitle>
        <BookOpen className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">428</div>
        <p className="text-xs text-muted-foreground">
          +42 from last month
        </p>
      </CardContent>
    </Card>
    
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest activities across your schools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">New teacher registered</p>
              <p className="text-xs text-muted-foreground">2 hours ago at West High School</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-secondary/10 rounded-full">
              <BookOpen className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">15 new students enrolled</p>
              <p className="text-xs text-muted-foreground">Yesterday at North Elementary</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <School className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">School year setup completed</p>
              <p className="text-xs text-muted-foreground">2 days ago at East Middle School</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminDashboard;
