
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FeeCategory } from '../../mock/feeCategories';
import { useFeeManagement } from '../../contexts/FeeManagementContext';

interface FeeCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategory?: FeeCategory | null;
  isEditMode: boolean;
}

const FeeCategoryDialog = ({
  isOpen,
  onOpenChange,
  initialCategory,
  isEditMode,
}: FeeCategoryDialogProps) => {
  const { addFeeCategory, updateFeeCategory } = useFeeManagement();
  const [category, setCategory] = useState<{
    name: string;
    description: string;
    tenantId: string;
  }>({
    name: '',
    description: '',
    tenantId: '1', // Default tenant ID for mock data
  });

  useEffect(() => {
    if (initialCategory) {
      setCategory({
        name: initialCategory.name,
        description: initialCategory.description,
        tenantId: initialCategory.tenantId,
      });
    } else if (!isOpen) {
      // Reset form when dialog is closed
      setCategory({
        name: '',
        description: '',
        tenantId: '1',
      });
    }
  }, [initialCategory, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (isEditMode && initialCategory) {
      updateFeeCategory(initialCategory.id, category);
    } else {
      addFeeCategory(category);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Fee Category' : 'Add New Fee Category'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <Input
              name="name"
              value={category.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              name="description"
              value={category.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} disabled={!category.name}>
            {isEditMode ? 'Update Category' : 'Add Category'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeeCategoryDialog;
