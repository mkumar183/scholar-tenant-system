
import { useState } from 'react';
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
  
  // Initialize the form with validation
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: '',
      address: '',
      type: '',
    },
  });

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
      
      // Simple debug logging
      console.log('Attempting to add school with:', { 
        values,
        tenantId,
        userRole: user?.role
      });
      
      // Create the school data object with explicit tenant_id
      const schoolData = {
        name: values.name,
        address: values.address || null,
        type: values.type || null,
        tenant_id: tenantId,
      };
      
      // Use direct table insert with simplified RLS
      const { data, error } = await supabase
        .from('schools')
        .insert([schoolData])
        .select();

      if (error) {
        console.error('Error adding school:', error);
        toast.error(`Failed to add school: ${error.message}`);
        return;
      }

      console.log('School added successfully:', data);
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
