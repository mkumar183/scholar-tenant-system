
import { FeeCategory } from "./feeCategories";

export interface FeeCategoryAmount {
  categoryId: string;
  amount: number;
}

export interface FeeGroup {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  createdAt: string;
  categories: FeeCategoryAmount[];
}

export const mockFeeGroups: FeeGroup[] = [
  {
    id: "1",
    name: "Grade 10 Term 1 Fees",
    description: "Fee structure for Grade 10 first term",
    tenantId: "1",
    createdAt: "2025-04-15",
    categories: [
      { categoryId: "1", amount: 5000 },
      { categoryId: "2", amount: 1000 },
      { categoryId: "3", amount: 1500 }
    ]
  },
  {
    id: "2",
    name: "Grade 11 Annual Fees",
    description: "Annual fees for Grade 11 students",
    tenantId: "1",
    createdAt: "2025-04-16",
    categories: [
      { categoryId: "1", amount: 10000 },
      { categoryId: "2", amount: 2000 },
      { categoryId: "4", amount: 3000 },
      { categoryId: "5", amount: 1500 }
    ]
  },
  {
    id: "3",
    name: "Grade 9 Term 2 Fees",
    description: "Fee structure for Grade 9 second term",
    tenantId: "1",
    createdAt: "2025-04-17",
    categories: [
      { categoryId: "1", amount: 4500 },
      { categoryId: "3", amount: 1200 }
    ]
  }
];
