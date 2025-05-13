
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ListFilter, PackageOpen, CreditCard } from 'lucide-react';

const FeeManagementNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="mb-6 border-b pb-4">
      <h1 className="text-2xl font-bold mb-4">Fee Management</h1>
      <div className="flex space-x-2">
        <Link to="/fee-management/categories">
          <Button 
            variant={currentPath.includes('/categories') ? "default" : "outline"}
            className="flex items-center"
          >
            <ListFilter className="mr-2 h-4 w-4" />
            Categories
          </Button>
        </Link>
        <Link to="/fee-management/groups">
          <Button 
            variant={currentPath.includes('/groups') ? "default" : "outline"}
            className="flex items-center"
          >
            <PackageOpen className="mr-2 h-4 w-4" />
            Fee Groups
          </Button>
        </Link>
        <Link to="/fee-management/assignments">
          <Button 
            variant={currentPath.includes('/assignments') ? "default" : "outline"}
            className="flex items-center"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Assignments
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeeManagementNav;
