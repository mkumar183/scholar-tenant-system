
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

export const TransportNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  return (
    <div className="mb-6">
      <Tabs defaultValue={currentPath || "vehicles"} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger 
            value="vehicles" 
            onClick={() => navigate("/transport-management/vehicles")}
          >
            Vehicles
          </TabsTrigger>
          <TabsTrigger 
            value="routes" 
            onClick={() => navigate("/transport-management/routes")}
          >
            Routes & Stops
          </TabsTrigger>
          <TabsTrigger 
            value="students" 
            onClick={() => navigate("/transport-management/students")}
          >
            Assign Students
          </TabsTrigger>
          <TabsTrigger 
            value="personnel" 
            onClick={() => navigate("/transport-management/personnel")}
          >
            Drivers & Conductors
          </TabsTrigger>
          <TabsTrigger 
            value="schedules" 
            onClick={() => navigate("/transport-management/schedules")}
          >
            Schedules
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
