
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { School, AlertCircle } from 'lucide-react';

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
  useState(() => {
    const checkConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        setConnectionError('Cannot connect to server. Please check your internet connection or try again later.');
      } else {
        setConnectionError(null);
      }
    };
    
    checkConnection();
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login submission error:', error);
      // Connection errors are handled in the login function via toast
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
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {connectionError}
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
                <Button type="submit" className="w-full" disabled={isLoading}>
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
