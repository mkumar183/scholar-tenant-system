
import { Routes, Route } from "react-router-dom";
import { TransportNav } from "../components/TransportNav";
import Vehicles from "./Vehicles";
import RoutesPage from "./Routes";
import Students from "./Students";
import Personnel from "./Personnel";

const TransportManagement = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Transport Management</h1>
      <TransportNav />
      <div className="mt-6">
        <Routes>
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/students" element={<Students />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/" element={<Vehicles />} />
        </Routes>
      </div>
    </div>
  );
};

export default TransportManagement;
