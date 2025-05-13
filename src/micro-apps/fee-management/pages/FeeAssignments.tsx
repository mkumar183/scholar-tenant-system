
import { FeeManagementProvider } from '../contexts/FeeManagementContext';
import FeeManagementNav from '../components/FeeManagementNav';
import FeeAssignmentsTable from '../components/fee-assignments/FeeAssignmentsTable';

const FeeAssignments = () => {
  return (
    <FeeManagementProvider>
      <div className="container mx-auto p-6">
        <FeeManagementNav />
        <div className="bg-white rounded-lg shadow p-6">
          <FeeAssignmentsTable />
        </div>
      </div>
    </FeeManagementProvider>
  );
};

export default FeeAssignments;
