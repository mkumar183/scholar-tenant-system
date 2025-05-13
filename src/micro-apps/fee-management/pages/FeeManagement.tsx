
import { Navigate } from 'react-router-dom';

const FeeManagement = () => {
  // Redirect to the fee categories page by default
  return <Navigate to="/fee-management/categories" replace />;
};

export default FeeManagement;
