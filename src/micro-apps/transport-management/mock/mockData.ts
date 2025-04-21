
import { Route, Vehicle, Personnel, Schedule, Stop, StudentTransport } from "../types/transport.types";

// Create proper Stop objects
export const mockStops: Stop[] = [
  {
    id: "stop-1",
    name: "Stop 1",
    lat: 37.7749,
    lng: -122.4194,
    route_id: "route-1",
    school_id: "1"
  },
  {
    id: "stop-2",
    name: "Stop 2",
    lat: 37.7848,
    lng: -122.4294,
    route_id: "route-1",
    school_id: "1"
  },
  {
    id: "stop-3",
    name: "Stop 3",
    lat: 37.7947,
    lng: -122.4394,
    route_id: "route-1",
    school_id: "1"
  },
  {
    id: "stop-4",
    name: "Stop 4",
    lat: 37.8046,
    lng: -122.4494,
    route_id: "route-2",
    school_id: "1"
  },
  {
    id: "stop-5",
    name: "Stop 5",
    lat: 37.8145,
    lng: -122.4594,
    route_id: "route-2",
    school_id: "1"
  },
  {
    id: "stop-6",
    name: "Stop 6",
    lat: 37.8244,
    lng: -122.4694,
    route_id: "route-2",
    school_id: "1"
  }
];

export const mockRoutes: Route[] = [
  {
    id: "route-1",
    name: "Route A",
    description: "Morning route covering north area",
    stops: mockStops.filter(stop => stop.route_id === "route-1"),
    school_id: "1",
  },
  {
    id: "route-2",
    name: "Route B",
    description: "Morning route covering south area",
    stops: mockStops.filter(stop => stop.route_id === "route-2"),
    school_id: "1",
  },
];

export const mockVehicles: Vehicle[] = [
  {
    id: "vehicle-1",
    registration_number: "ABC-123",
    type: "bus",
    capacity: 20,
    school_id: "1",
  },
  {
    id: "vehicle-2",
    registration_number: "XYZ-789",
    type: "van",
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
    license_number: "", // Adding the required license_number field
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

// Adding student transport assignments mock data
export const mockStudentTransport: StudentTransport[] = [
  {
    id: "st-1",
    student_id: "S001",
    route_id: "route-1",
    stop_id: "stop-1",
    type: "both"
  },
  {
    id: "st-2",
    student_id: "S002",
    route_id: "route-1",
    stop_id: "stop-2",
    type: "pickup"
  },
  {
    id: "st-3",
    student_id: "S003",
    route_id: "route-2",
    stop_id: "stop-4",
    type: "drop"
  },
  {
    id: "st-4",
    student_id: "S004",
    route_id: "route-2",
    stop_id: "stop-5",
    type: "both"
  }
];
