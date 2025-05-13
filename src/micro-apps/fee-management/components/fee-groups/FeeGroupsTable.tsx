
import { useState } from 'react';
import { FeeGroup } from '../../mock/feeGroups';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useFeeManagement } from '../../contexts/FeeManagementContext';
import FeeGroupDialog from './FeeGroupDialog';
import { Badge } from '@/components/ui/badge';

const FeeGroupsTable = () => {
  const { feeGroups, feeCategories, deleteFeeGroup } = useFeeManagement();
  const [editingGroup, setEditingGroup] = useState<FeeGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<FeeGroup | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const handleEdit = (group: FeeGroup) => {
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const handleDelete = (group: FeeGroup) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (groupToDelete) {
      deleteFeeGroup(groupToDelete.id);
      toast.success('Fee group deleted successfully');
      setDeleteDialogOpen(false);
      setGroupToDelete(null);
    }
  };

  const toggleExpandGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const getCategoryName = (categoryId: string) => {
    return feeCategories.find(cat => cat.id === categoryId)?.name || 'Unknown Category';
  };

  const calculateTotalAmount = (group: FeeGroup) => {
    return group.categories.reduce((total, cat) => total + cat.amount, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Fee Groups</h2>
        <Button onClick={() => {
          setEditingGroup(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeGroups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No fee groups found. Add your first group to get started.
              </TableCell>
            </TableRow>
          ) : (
            feeGroups.map((group) => (
              <>
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Badge>{group.categories.length}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleExpandGroup(group.id)}
                      >
                        <Eye className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>₹{calculateTotalAmount(group).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(group)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(group)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedGroup === group.id && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/30">
                      <div className="py-2 px-4">
                        <h4 className="font-medium mb-2">Categories in this group:</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.categories.map((cat, index) => (
                              <TableRow key={index}>
                                <TableCell>{getCategoryName(cat.categoryId)}</TableCell>
                                <TableCell>₹{cat.amount.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          )}
        </TableBody>
      </Table>

      <FeeGroupDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialGroup={editingGroup}
        isEditMode={!!editingGroup}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the fee group "{groupToDelete?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FeeGroupsTable;
