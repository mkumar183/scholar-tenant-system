
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface EditSchoolFormProps {
  school: {
    id: string;
    name: string;
    address: string | null;
    type: string | null;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  address: string;
  type: string;
}

export function EditSchoolForm({ school, onSuccess, onCancel }: EditSchoolFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      name: school.name,
      address: school.address || '',
      type: school.type || '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('schools')
        .update({
          name: values.name,
          address: values.address || null,
          type: values.type || null,
        })
        .eq('id', school.id);

      if (error) throw error;

      toast.success('School information updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating school:', error);
      toast.error('Failed to update school information');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
