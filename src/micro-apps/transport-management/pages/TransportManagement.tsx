
import { TransportNav } from "../components/TransportNav";

const TransportManagement = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Transport Management</h1>
      <TransportNav />
      {/* Content will be rendered by child routes */}
    </div>
  );
};

export default TransportManagement;
