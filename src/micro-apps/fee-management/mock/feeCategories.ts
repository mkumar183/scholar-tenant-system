
export interface FeeCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tenantId: string;
}

export const mockFeeCategories: FeeCategory[] = [
  {
    id: "1",
    name: "Tuition Fee",
    description: "Regular tuition fee charged per term",
    createdAt: "2025-04-10",
    tenantId: "1"
  },
  {
    id: "2",
    name: "Library Fee",
    description: "Annual fee for library resources and maintenance",
    createdAt: "2025-04-10",
    tenantId: "1"
  },
  {
    id: "3",
    name: "Exam Fee",
    description: "Fee charged for term examinations",
    createdAt: "2025-04-11",
    tenantId: "1"
  },
  {
    id: "4",
    name: "Lab Fee",
    description: "Fee for laboratory resources and consumables",
    createdAt: "2025-04-11",
    tenantId: "1"
  },
  {
    id: "5",
    name: "Sports Fee",
    description: "Fee for sports equipment and facilities",
    createdAt: "2025-04-12",
    tenantId: "1"
  }
];
