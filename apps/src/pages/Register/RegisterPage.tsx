
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { RegisterForm } from './RegisterForm';
import { FormValues } from './schema';

export const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await register(values.email, values.password, values.name, values.role);
      toast.success('Registration successful! Redirecting to login...');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Registration failed. Please try again.');
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
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Create a new account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
