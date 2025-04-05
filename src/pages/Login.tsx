
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { School, AlertCircle, WifiOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkSupabaseConnection } from '@/lib/supabase';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Check Supabase connection on component mount
  useEffect(() => {
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
      
      // Debug: Log the state variables that affect button enabled status
      console.log('Connection check complete. Button disable conditions:', {
        isLoading,
        connectionError: !!connectionError,
        isCheckingConnection: false
      });
    };
    
    checkConnection();
  }, []);

  // Add this to debug form validity
  useEffect(() => {
    const subscription = form.watch(() => {
      console.log('Form state:', {
        isValid: form.formState.isValid,
        isDirty: form.formState.isDirty,
        errors: form.formState.errors
      });
    });
    
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  const retryConnection = async () => {
    setIsCheckingConnection(true);
    setConnectionError(null);
    
    const { connected, error } = await checkSupabaseConnection();
    
    if (!connected) {
      setConnectionError(`Cannot connect to server: ${error || 'Please check your internet connection or try again later.'}`);
      toast.error("Connection to server failed. Please check your internet connection.");
    } else {
      setConnectionError(null);
      toast.success("Connection restored successfully!");
    }
    
    setIsCheckingConnection(false);
    
    // Debug: Log button state after connection retry
    console.log('After retry. Button disable conditions:', {
      isLoading,
      connectionError: connected ? null : 'error',
      isCheckingConnection: false
    });
  };

  const onSubmit = async (values: FormValues) => {
    if (connectionError) {
      toast.error("Cannot log in while offline. Please check your connection.");
      return;
    }
    
    setIsLoading(true);
    console.log('Login attempt started. Button should be disabled:', { isLoading: true });
    
    try {
      // Double-check connection before attempting login
      const { connected } = await checkSupabaseConnection();
      if (!connected) {
        throw new Error("Network connection unavailable");
      }
      
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login submission error:', error);
      // Connection errors are handled in the login function via toast
    } finally {
      setIsLoading(false);
      console.log('Login attempt finished. Button should be enabled:', { isLoading: false });
    }
  };

  // Debug: Log current state of variables affecting button
  const isButtonDisabled = isLoading || !!connectionError || isCheckingConnection;
  console.log('Current button state:', {
    isDisabled: isButtonDisabled,
    isLoading,
    connectionError: !!connectionError,
    isCheckingConnection
  });

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
              <Alert variant="destructive" className="mb-4">
                <WifiOff className="h-4 w-4 mr-2" />
                <AlertDescription className="flex flex-col gap-2">
                  <span>{connectionError}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="self-start mt-2"
                    onClick={retryConnection}
                    disabled={isCheckingConnection}
                  >
                    {isCheckingConnection ? 'Checking connection...' : 'Retry connection'}
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Debug display */}
                <div className="text-xs text-amber-500 border border-amber-200 p-2 rounded bg-amber-50 mb-2">
                  <p>Debug: Button disabled: {isButtonDisabled ? 'Yes' : 'No'}</p>
                  <p>- Is Loading: {isLoading ? 'Yes' : 'No'}</p>
                  <p>- Connection Error: {connectionError ? 'Yes' : 'No'}</p>
                  <p>- Checking Connection: {isCheckingConnection ? 'Yes' : 'No'}</p>
                  <p>- Form Valid: {form.formState.isValid ? 'Yes' : 'No'}</p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !!connectionError || isCheckingConnection}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Demo accounts:</p>
          <p>Admin: admin@example.com / password</p>
          <p>School Admin: school@example.com / password</p>
          <p>Teacher: teacher@example.com / password</p>
          <p>Student: student@example.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
