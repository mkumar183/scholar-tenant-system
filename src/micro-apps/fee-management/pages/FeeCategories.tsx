
import { FeeManagementProvider } from '../contexts/FeeManagementContext';
import FeeManagementNav from '../components/FeeManagementNav';
import FeeCategoriesTable from '../components/fee-categories/FeeCategoriesTable';

const FeeCategories = () => {
  return (
    <FeeManagementProvider>
      <div className="container mx-auto p-6">
        <FeeManagementNav />
        <div className="bg-white rounded-lg shadow p-6">
          <FeeCategoriesTable />
        </div>
      </div>
    </FeeManagementProvider>
  );
};

export default FeeCategories;
