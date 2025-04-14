
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { checkSupabaseConnection } from '@/lib/supabase';
import { toast } from 'sonner';
import LoginForm from '@/components/auth/LoginForm';
import ConnectionError from '@/components/auth/ConnectionError';
import DemoAccounts from '@/components/auth/DemoAccounts';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    const { connected, error } = await checkSupabaseConnection();
    
    if (!connected) {
      setConnectionError(`Cannot connect to server: ${error || 'Please check your internet connection or try again later.'}`);
      toast.error("Connection to server failed. Please check your internet connection.");
    } else {
      setConnectionError(null);
    }
    setIsCheckingConnection(false);
  };

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    if (connectionError) {
      toast.error("Cannot log in while offline. Please check your connection.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { connected } = await checkSupabaseConnection();
      if (!connected) {
        throw new Error("Network connection unavailable");
      }
      
      await login(email, password);
    } catch (error) {
      console.error('Login submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <School className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Scholar System</h1>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectionError && (
              <ConnectionError 
                error={connectionError}
                onRetry={checkConnection}
                isChecking={isCheckingConnection}
              />
            )}
            
            <LoginForm 
              onSubmit={onSubmit}
              isLoading={isLoading}
              isDisabled={!!connectionError || isCheckingConnection}
            />
          </CardContent>
        </Card>
        
        <DemoAccounts />
      </div>
    </div>
  );
};

export default Login;
