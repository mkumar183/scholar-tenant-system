
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

// School types for dropdown
const SCHOOL_TYPES = [
  'Elementary School',
  'Middle School',
  'High School',
  'Private School',
  'Charter School',
  'Alternative School',
];

// Form validation schema
const schoolFormSchema = z.object({
  name: z.string().min(2, { message: "School name must be at least 2 characters" }),
  address: z.string().optional(),
  type: z.string().optional(),
});

type SchoolFormValues = z.infer<typeof schoolFormSchema>;

interface AddSchoolFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddSchoolForm = ({ onSuccess, onCancel }: AddSchoolFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jwtDetails, setJwtDetails] = useState<any>(null);
  
  // Initialize the form with validation
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: '',
      address: '',
      type: '',
    },
  });
  
  // Fetch the current session and extract JWT details on component mount
  useEffect(() => {
    const getJwtDetails = async () => {
      try {
        // Get current session
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.access_token) {
          // Parse JWT to view claims
          const token = data.session.access_token;
          const claims = JSON.parse(atob(token.split('.')[1]));
          
          console.log('JWT claims:', claims);
          setJwtDetails({
            role: claims.role,
            tenantId: claims.app_metadata?.tenant_id,
            exp: new Date(claims.exp * 1000).toLocaleString(),
            sub: claims.sub,
            raw: claims
          });
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error parsing JWT:', error);
      }
    };
    
    getJwtDetails();
  }, []);

  // Ensure tenant ID is available before allowing submission
  const tenantId = user?.tenantId;

  const handleSubmit = async (values: SchoolFormValues) => {
    // Verify tenant ID is available before proceeding
    if (!tenantId) {
      toast.error('No tenant ID found. Please refresh the page or log in again.');
      console.error("Missing tenant ID during form submission. User object:", user);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // First, refresh the session to ensure we have the latest JWT claims
      console.log('Refreshing session...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Failed to refresh session:', refreshError);
        toast.error('Authentication refresh failed. Please log in again.');
        return;
      }
      
      // Get the latest session after refresh
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.error('No session available after refresh');
        toast.error('Session not available. Please log in again.');
        return;
      }
      
      // Parse and log JWT claims for debugging
      const token = sessionData.session.access_token;
      const claims = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT claims after refresh:', claims);
      
      // Check if the necessary role is present in the JWT
      if (!claims.role) {
        console.error('JWT missing role claim:', claims);
        toast.error('Authorization error: Your account is missing the required role. Please contact support.');
        return;
      }
      
      // Create the school data object
      const schoolData = {
        name: values.name,
        address: values.address || null,
        type: values.type || null,
        tenant_id: tenantId,
      };
      
      console.log('Attempting to insert school with data:', schoolData);
      console.log('Current user role from JWT:', claims.role);
      
      // Try direct table insert
      const { data: insertData, error: insertError } = await supabase
        .from('schools')
        .insert([schoolData])
        .select();

      if (insertError) {
        console.error('School insertion failed:', insertError);
        
        if (insertError.code === 'PGRST301') {
          toast.error('Permission denied: You do not have the required role to add schools.');
        } else if (insertError.message.includes('violates row-level security')) {
          toast.error('Row-level security violation. Your JWT may be missing required claims.');
        } else {
          toast.error(`Failed to add school: ${insertError.message}`);
        }
        return;
      }
      
      console.log('School added successfully:', insertData);
      toast.success('School added successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Exception adding school:', error);
      toast.error(`Unexpected error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {!tenantId && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-4">
            No tenant ID available. Please refresh the page.
          </div>
        )}
        
        {jwtDetails && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded mb-4 text-xs">
            <div><strong>JWT Role:</strong> {jwtDetails.role || 'none'}</div>
            <div><strong>JWT Tenant ID:</strong> {jwtDetails.tenantId || 'none'}</div>
            <div><strong>JWT Expiry:</strong> {jwtDetails.exp}</div>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter school name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter school address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SCHOOL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !tenantId}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add School'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddSchoolForm;
