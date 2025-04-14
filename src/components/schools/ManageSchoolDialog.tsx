
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ManageSchoolDialogProps {
  isOpen: boolean;
  onClose: () => void;
  school: {
    id: string;
    name: string;
    address: string | null;
    type: string | null;
  };
  onSchoolUpdated: () => void;
}

const ManageSchoolDialog = ({ 
  isOpen, 
  onClose, 
  school, 
  onSchoolUpdated 
}: ManageSchoolDialogProps) => {
  const [adminEmail, setAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [schoolName, setSchoolName] = useState(school.name);
  const [schoolAddress, setSchoolAddress] = useState(school.address || '');
  const [schoolType, setSchoolType] = useState(school.type || '');

  const handleUpdateSchool = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('schools')
        .update({
          name: schoolName,
          address: schoolAddress,
          type: schoolType,
        })
        .eq('id', school.id);

      if (error) throw error;
      
      toast.success('School updated successfully');
      onSchoolUpdated();
      onClose();
    } catch (error: any) {
      console.error('Error updating school:', error);
      toast.error('Failed to update school');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignAdmin = async () => {
    if (!adminEmail) {
      toast.error('Please enter an admin email');
      return;
    }

    setIsLoading(true);
    try {
      // First create the user in auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: Math.random().toString(36).slice(-8), // Generate random password
        options: {
          data: {
            role: 'school_admin',
          }
        }
      });

      if (authError) throw authError;

      if (authUser.user) {
        // Create the user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authUser.user.id,
            role: 'school_admin',
            school_id: school.id,
            email: adminEmail,
          });

        if (profileError) throw profileError;

        toast.success('School admin invited successfully');
        setAdminEmail('');
      }
    } catch (error: any) {
      console.error('Error assigning admin:', error);
      toast.error('Failed to assign admin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage School</DialogTitle>
          <DialogDescription>
            Update school information and manage administrators
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              id="name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={schoolAddress}
              onChange={(e) => setSchoolAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">School Type</Label>
            <Input
              id="type"
              value={schoolType}
              onChange={(e) => setSchoolType(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleUpdateSchool} 
            disabled={isLoading}
            className="w-full"
          >
            Update School Information
          </Button>

          <div className="border-t pt-4 mt-4">
            <Label htmlFor="adminEmail">Assign School Administrator</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@school.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
              <Button onClick={handleAssignAdmin} disabled={isLoading}>
                Assign
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageSchoolDialog;
