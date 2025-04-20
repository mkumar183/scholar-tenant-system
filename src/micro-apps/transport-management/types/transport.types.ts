
export interface Vehicle {
  id: string;
  vehicleNumber: string;
  capacity: number;
  model: string;
  status: 'active' | 'maintenance' | 'inactive';
  school_id: string;
}

export interface Route {
  id: string;
  name: string;
  description?: string;
  school_id: string;
  vehicle_id?: string;
  status: 'active' | 'inactive';
}

export interface Stop {
  id: string;
  route_id: string;
  name: string;
  order: number;
  estimated_arrival_time: string;
}

export interface Personnel {
  id: string;
  name: string;
  type: 'driver' | 'conductor';
  contact: string;
  license_number?: string;
  school_id: string;
  route_id?: string;
  status: 'active' | 'inactive';
}

export interface StudentTransport {
  id: string;
  student_id: string;
  route_id: string;
  stop_id: string;
  type: 'pickup' | 'drop' | 'both';
}
