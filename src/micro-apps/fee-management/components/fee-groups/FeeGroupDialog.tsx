
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeeGroup, FeeCategoryAmount } from '../../mock/feeGroups';
import { useFeeManagement } from '../../contexts/FeeManagementContext';
import { X, Plus } from 'lucide-react';

interface FeeGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialGroup?: FeeGroup | null;
  isEditMode: boolean;
}

const FeeGroupDialog = ({
  isOpen,
  onOpenChange,
  initialGroup,
  isEditMode,
}: FeeGroupDialogProps) => {
  const { feeCategories, addFeeGroup, updateFeeGroup } = useFeeManagement();
  const [group, setGroup] = useState<{
    name: string;
    description: string;
    tenantId: string;
    categories: FeeCategoryAmount[];
  }>({
    name: '',
    description: '',
    tenantId: '1', // Default tenant ID for mock data
    categories: [],
  });

  useEffect(() => {
    if (initialGroup) {
      setGroup({
        name: initialGroup.name,
        description: initialGroup.description,
        tenantId: initialGroup.tenantId,
        categories: [...initialGroup.categories],
      });
    } else if (!isOpen) {
      // Reset form when dialog is closed
      setGroup({
        name: '',
        description: '',
        tenantId: '1',
        categories: [],
      });
    }
  }, [initialGroup, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGroup(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryAdd = () => {
    // Find a category that hasn't been added yet
    const availableCategories = feeCategories.filter(
      cat => !group.categories.some(c => c.categoryId === cat.id)
    );
    
    if (availableCategories.length > 0) {
      setGroup(prev => ({
        ...prev,
        categories: [
          ...prev.categories,
          { categoryId: availableCategories[0].id, amount: 0 }
        ]
      }));
    }
  };

  const handleCategoryChange = (index: number, categoryId: string) => {
    const updatedCategories = [...group.categories];
    updatedCategories[index].categoryId = categoryId;
    setGroup(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  const handleAmountChange = (index: number, amount: string) => {
    const updatedCategories = [...group.categories];
    updatedCategories[index].amount = parseInt(amount) || 0;
    setGroup(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  const handleRemoveCategory = (index: number) => {
    const updatedCategories = [...group.categories];
    updatedCategories.splice(index, 1);
    setGroup(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  const handleSubmit = () => {
    if (isEditMode && initialGroup) {
      updateFeeGroup(initialGroup.id, group);
    } else {
      addFeeGroup(group);
    }
    onOpenChange(false);
  };

  // Check if any category is available to add
  const canAddMoreCategories = feeCategories.length > group.categories.length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Fee Group' : 'Add New Fee Group'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <Input
              name="name"
              value={group.name}
              onChange={handleChange}
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              name="description"
              value={group.description}
              onChange={handleChange}
              placeholder="Enter group description"
              rows={2}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Fee Categories</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleCategoryAdd}
                disabled={!canAddMoreCategories}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Category
              </Button>
            </div>

            {group.categories.length === 0 ? (
              <div className="text-center py-4 border border-dashed rounded-md text-muted-foreground">
                No categories added. Click "Add Category" to start.
              </div>
            ) : (
              <div className="space-y-3">
                {group.categories.map((categoryAmount, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-2 rounded-md">
                    <div className="flex-1">
                      <Select
                        value={categoryAmount.categoryId}
                        onValueChange={(value) => handleCategoryChange(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {feeCategories
                            .filter(cat => 
                              cat.id === categoryAmount.categoryId || 
                              !group.categories.some(c => c.categoryId === cat.id)
                            )
                            .map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        min="0"
                        value={categoryAmount.amount}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        placeholder="Amount"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!group.name || group.categories.length === 0}
            className="w-full"
          >
            {isEditMode ? 'Update Fee Group' : 'Create Fee Group'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeeGroupDialog;
