
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoutesTable } from "../components/routes/RoutesTable";
import { RouteDialog } from "../components/routes/RouteDialog";
import { Route, Stop } from "../types/transport.types";
import { mockRoutes } from "../mock/mockData";
import { StopsView } from "../components/stops/StopsView";

const Routes = () => {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [open, setOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);

  const handleAddRoute = (route: Route) => {
    const newRoute: Route = {
      ...route,
      id: String(routes.length + 1),
      school_id: "1"
    };
    setRoutes((prev) => [...prev, newRoute]);
    setOpen(false);
  };

  const handleEditRoute = (route: Route) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === route.id ? route : r))
    );
    setEditingRoute(null);
    setOpen(false);
  };

  const handleDeleteRoute = (id: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
    if (selectedRoute?.id === id) {
      setSelectedRoute(null);
    }
  };

  const handleViewStops = (route: Route) => {
    setSelectedRoute(route);
    // In a real application, you would fetch the stops for this route from the backend
    setStops([]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Routes</h2>
          <Button onClick={() => {
            setEditingRoute(null);
            setOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Route
          </Button>
        </div>

        <RoutesTable
          routes={routes}
          onEdit={(route) => {
            setEditingRoute(route);
            setOpen(true);
          }}
          onDelete={handleDeleteRoute}
          onViewStops={handleViewStops}
        />

        <RouteDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={editingRoute ? handleEditRoute : handleAddRoute}
          route={editingRoute}
        />
      </div>

      {selectedRoute && (
        <div className="mt-8">
          <StopsView
            route={selectedRoute}
            stops={stops}
            onUpdateStops={setStops}
          />
        </div>
      )}
    </div>
  );
};

export default Routes;
