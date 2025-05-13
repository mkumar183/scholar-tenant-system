
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FeeCategory, mockFeeCategories } from '../mock/feeCategories';
import { FeeGroup, mockFeeGroups } from '../mock/feeGroups';
import { FeeAssignment, mockFeeAssignments } from '../mock/feeAssignments';

interface FeeManagementContextType {
  // Data states
  feeCategories: FeeCategory[];
  feeGroups: FeeGroup[];
  feeAssignments: FeeAssignment[];
  
  // CRUD operations for Fee Categories
  addFeeCategory: (category: Omit<FeeCategory, 'id' | 'createdAt'>) => void;
  updateFeeCategory: (id: string, category: Partial<FeeCategory>) => void;
  deleteFeeCategory: (id: string) => void;
  
  // CRUD operations for Fee Groups
  addFeeGroup: (group: Omit<FeeGroup, 'id' | 'createdAt'>) => void;
  updateFeeGroup: (id: string, group: Partial<FeeGroup>) => void;
  deleteFeeGroup: (id: string) => void;
  
  // CRUD operations for Fee Assignments
  addFeeAssignment: (assignment: Omit<FeeAssignment, 'id' | 'createdAt'>) => void;
  updateFeeAssignment: (id: string, assignment: Partial<FeeAssignment>) => void;
  deleteFeeAssignment: (id: string) => void;
}

const FeeManagementContext = createContext<FeeManagementContextType | undefined>(undefined);

export function FeeManagementProvider({ children }: { children: ReactNode }) {
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>(mockFeeCategories);
  const [feeGroups, setFeeGroups] = useState<FeeGroup[]>(mockFeeGroups);
  const [feeAssignments, setFeeAssignments] = useState<FeeAssignment[]>(mockFeeAssignments);

  // Fee Categories CRUD
  const addFeeCategory = (category: Omit<FeeCategory, 'id' | 'createdAt'>) => {
    const newCategory: FeeCategory = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFeeCategories([...feeCategories, newCategory]);
  };

  const updateFeeCategory = (id: string, category: Partial<FeeCategory>) => {
    setFeeCategories(
      feeCategories.map(item => 
        item.id === id ? { ...item, ...category } : item
      )
    );
  };

  const deleteFeeCategory = (id: string) => {
    setFeeCategories(feeCategories.filter(category => category.id !== id));
  };

  // Fee Groups CRUD
  const addFeeGroup = (group: Omit<FeeGroup, 'id' | 'createdAt'>) => {
    const newGroup: FeeGroup = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFeeGroups([...feeGroups, newGroup]);
  };

  const updateFeeGroup = (id: string, group: Partial<FeeGroup>) => {
    setFeeGroups(
      feeGroups.map(item => 
        item.id === id ? { ...item, ...group } : item
      )
    );
  };

  const deleteFeeGroup = (id: string) => {
    setFeeGroups(feeGroups.filter(group => group.id !== id));
  };

  // Fee Assignments CRUD
  const addFeeAssignment = (assignment: Omit<FeeAssignment, 'id' | 'createdAt'>) => {
    const newAssignment: FeeAssignment = {
      ...assignment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFeeAssignments([...feeAssignments, newAssignment]);
  };

  const updateFeeAssignment = (id: string, assignment: Partial<FeeAssignment>) => {
    setFeeAssignments(
      feeAssignments.map(item => 
        item.id === id ? { ...item, ...assignment } : item
      )
    );
  };

  const deleteFeeAssignment = (id: string) => {
    setFeeAssignments(feeAssignments.filter(assignment => assignment.id !== id));
  };

  const value: FeeManagementContextType = {
    feeCategories,
    feeGroups,
    feeAssignments,
    addFeeCategory,
    updateFeeCategory,
    deleteFeeCategory,
    addFeeGroup,
    updateFeeGroup,
    deleteFeeGroup,
    addFeeAssignment,
    updateFeeAssignment,
    deleteFeeAssignment
  };

  return (
    <FeeManagementContext.Provider value={value}>
      {children}
    </FeeManagementContext.Provider>
  );
}

export const useFeeManagement = () => {
  const context = useContext(FeeManagementContext);
  if (context === undefined) {
    throw new Error('useFeeManagement must be used within a FeeManagementProvider');
  }
  return context;
};
