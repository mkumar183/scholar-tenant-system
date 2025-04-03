
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  LogOut, 
  School, 
  Users, 
  BookOpen, 
  LayoutDashboard, 
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-2 mb-8">
          <School className="h-8 w-8" />
          <h1 className="text-xl font-bold">Scholar System</h1>
        </div>
        
        <nav className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-primary-foreground hover:text-primary-foreground hover:bg-primary/80"
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
          </Button>

          {(user.role === 'admin' || user.role === 'school_admin') && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-primary-foreground hover:text-primary-foreground hover:bg-primary/80"
              onClick={() => navigate('/tenants')}
            >
              <Users className="mr-2 h-5 w-5" />
              Tenants
            </Button>
          )}

          {(user.role === 'admin' || user.role === 'school_admin') && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-primary-foreground hover:text-primary-foreground hover:bg-primary/80"
              onClick={() => navigate('/schools')}
            >
              <School className="mr-2 h-5 w-5" />
              Schools
            </Button>
          )}

          {user.role !== 'student' && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-primary-foreground hover:text-primary-foreground hover:bg-primary/80"
              onClick={() => navigate('/users')}
            >
              <Users className="mr-2 h-5 w-5" />
              Users
            </Button>
          )}

          <Button 
            variant="ghost" 
            className="w-full justify-start text-primary-foreground hover:text-primary-foreground hover:bg-primary/80"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-primary-foreground hover:text-primary-foreground hover:bg-primary/80"
            onClick={logout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {window.location.pathname.split('/')[1].charAt(0).toUpperCase() + 
               window.location.pathname.split('/')[1].slice(1) || 'Dashboard'}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <h1 className="text-2xl font-bold">
              {window.location.pathname === '/dashboard' ? 'Dashboard' : 
              window.location.pathname.split('/')[1].charAt(0).toUpperCase() + 
              window.location.pathname.split('/')[1].slice(1)}
            </h1>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
