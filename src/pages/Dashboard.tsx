
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Users, User, BookOpen, ChevronUp, LineChart, CalendarRange } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const AdminDashboard = () => (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
          <School className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">28</div>
          <p className="text-xs text-muted-foreground">
            +4 from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,245</div>
          <p className="text-xs text-muted-foreground">
            +18% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>
            Current status and statistics for the entire system
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Tenants</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-secondary/10 rounded-full">
              <School className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium">Schools</p>
              <p className="text-2xl font-bold">28</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Teachers</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-secondary/10 rounded-full">
              <BookOpen className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium">Students</p>
              <p className="text-2xl font-bold">1,089</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SchoolAdminDashboard = () => (
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

  const TeacherDashboard = () => (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Students</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">28</div>
          <p className="text-xs text-muted-foreground">In 3 classes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">
            Next: Math at 10:00 AM
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12 classes</div>
          <p className="text-xs text-muted-foreground">
            3 assignments due
          </p>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Class Overview</CardTitle>
          <CardDescription>
            Your current teaching schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Mathematics - Grade 9</p>
                <p className="text-xs text-muted-foreground">28 students - Room 101</p>
              </div>
              <div className="text-sm">10:00 AM</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-secondary/10 rounded-full">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Science - Grade 8</p>
                <p className="text-xs text-muted-foreground">24 students - Room 203</p>
              </div>
              <div className="text-sm">1:30 PM</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Mathematics - Grade 10</p>
                <p className="text-xs text-muted-foreground">22 students - Room 101</p>
              </div>
              <div className="text-sm">3:00 PM</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const StudentDashboard = () => (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Classes</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">6</div>
          <p className="text-xs text-muted-foreground">
            Next: Science at 11:30 AM
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assignments</CardTitle>
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">
            Due this week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">A-</div>
          <p className="text-xs text-muted-foreground">
            +5% from last semester
          </p>
        </CardContent>
      </Card>
      
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>
            Your classes for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">English Literature</p>
                <p className="text-xs text-muted-foreground">Ms. Johnson - Room 102</p>
              </div>
              <div className="text-sm">8:30 AM</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-secondary/10 rounded-full">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Science</p>
                <p className="text-xs text-muted-foreground">Mr. Roberts - Room 203</p>
              </div>
              <div className="text-sm">11:30 AM</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Mathematics</p>
                <p className="text-xs text-muted-foreground">Mrs. Davis - Room 101</p>
              </div>
              <div className="text-sm">2:00 PM</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div>
      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role === 'school_admin' && <SchoolAdminDashboard />}
      {user?.role === 'teacher' && <TeacherDashboard />}
      {user?.role === 'student' && <StudentDashboard />}
    </div>
  );
};

export default Dashboard;
