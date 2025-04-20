import { Route, Vehicle, Personnel, Schedule } from "../types/transport.types";

export const mockRoutes: Route[] = [
  {
    id: "route-1",
    name: "Route A",
    stops: ["Stop 1", "Stop 2", "Stop 3"],
    school_id: "1",
  },
  {
    id: "route-2",
    name: "Route B",
    stops: ["Stop 4", "Stop 5", "Stop 6"],
    school_id: "1",
  },
];

export const mockVehicles: Vehicle[] = [
  {
    id: "vehicle-1",
    registration_number: "ABC-123",
    type: "bus",
    model: "Toyota Coaster",
    capacity: 20,
    school_id: "1",
  },
  {
    id: "vehicle-2",
    registration_number: "XYZ-789",
    type: "van",
    model: "Nissan Caravan",
    capacity: 12,
    school_id: "1",
  },
];

export const mockPersonnel: Personnel[] = [
  {
    id: "personnel-1",
    name: "John Doe",
    type: "driver",
    contact: "123-456-7890",
    license_number: "DL12345",
    school_id: "1",
    route_id: "route-1",
    status: "active",
  },
  {
    id: "personnel-2",
    name: "Jane Smith",
    type: "conductor",
    contact: "098-765-4321",
    school_id: "1",
    route_id: "route-1",
    status: "active",
  },
];

// Add schedules to the mock data
export const mockSchedules: Schedule[] = [
  {
    id: "schedule-1",
    route_id: "route-1",
    vehicle_id: "vehicle-1",
    day_type: "weekday",
    departure_time: "07:30",
    arrival_time: "08:15",
    status: "active",
    school_id: "1"
  },
  {
    id: "schedule-2",
    route_id: "route-2",
    vehicle_id: "vehicle-2",
    day_type: "weekday",
    departure_time: "07:45",
    arrival_time: "08:30",
    status: "active",
    school_id: "1"
  },
  {
    id: "schedule-3",
    route_id: "route-1",
    vehicle_id: "vehicle-1",
    day_type: "weekday",
    departure_time: "14:30",
    arrival_time: "15:15",
    status: "active",
    school_id: "1"
  },
  {
    id: "schedule-4",
    route_id: "route-2",
    vehicle_id: "vehicle-2",
    day_type: "weekday",
    departure_time: "14:45",
    arrival_time: "15:30",
    status: "active",
    school_id: "1"
  }
];
