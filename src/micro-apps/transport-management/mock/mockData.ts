
import { Vehicle, Route, Stop, Personnel, StudentTransport } from '../types/transport.types';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    vehicleNumber: 'KA01AB1234',
    capacity: 40,
    model: 'Ashok Leyland',
    status: 'active',
    school_id: '1'
  },
  {
    id: '2',
    vehicleNumber: 'KA01CD5678',
    capacity: 35,
    model: 'Tata',
    status: 'active',
    school_id: '1'
  }
];

export const mockRoutes: Route[] = [
  {
    id: '1',
    name: 'Route 1 - North',
    description: 'Covers northern area of the city',
    school_id: '1',
    vehicle_id: '1',
    status: 'active'
  },
  {
    id: '2',
    name: 'Route 2 - South',
    description: 'Covers southern area of the city',
    school_id: '1',
    vehicle_id: '2',
    status: 'active'
  }
];

export const mockStops: Stop[] = [
  {
    id: '1',
    route_id: '1',
    name: 'Stop 1 - Market',
    order: 1,
    estimated_arrival_time: '07:30'
  },
  {
    id: '2',
    route_id: '1',
    name: 'Stop 2 - Park',
    order: 2,
    estimated_arrival_time: '07:45'
  }
];

export const mockPersonnel: Personnel[] = [
  {
    id: '1',
    name: 'John Doe',
    type: 'driver',
    contact: '9876543210',
    license_number: 'DL123456',
    school_id: '1',
    route_id: '1',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    type: 'conductor',
    contact: '9876543211',
    school_id: '1',
    route_id: '1',
    status: 'active'
  }
];

export const mockStudentTransport: StudentTransport[] = [
  {
    id: '1',
    student_id: '1',
    route_id: '1',
    stop_id: '1',
    type: 'both'
  },
  {
    id: '2',
    student_id: '2',
    route_id: '1',
    stop_id: '2',
    type: 'pickup'
  }
];
