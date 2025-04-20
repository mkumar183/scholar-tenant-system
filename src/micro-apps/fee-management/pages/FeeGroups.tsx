
import { FeeManagementProvider } from '../contexts/FeeManagementContext';
import FeeManagementNav from '../components/FeeManagementNav';
import FeeGroupsTable from '../components/fee-groups/FeeGroupsTable';

const FeeGroups = () => {
  return (
    <FeeManagementProvider>
      <div className="container mx-auto p-6">
        <FeeManagementNav />
        <div className="bg-white rounded-lg shadow p-6">
          <FeeGroupsTable />
        </div>
      </div>
    </FeeManagementProvider>
  );
};

export default FeeGroups;
