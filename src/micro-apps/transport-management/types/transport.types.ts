export interface Route {
  id: string;
  name: string;
  description: string;
  stops: Stop[];
  school_id: string;
}

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  route_id: string;
  school_id: string;
}

export interface Vehicle {
  id: string;
  registration_number: string;
  type: "bus" | "van" | "other";
  capacity: number;
  school_id: string;
}

export interface Personnel {
  id: string;
  name: string;
  type: "driver" | "conductor";
  contact: string;
  license_number: string;
  school_id: string;
  route_id: string;
  status: "active" | "inactive";
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  contact: string;
  address: string;
  school_id: string;
  route_id: string;
}

export interface Schedule {
  id: string;
  route_id: string;
  vehicle_id: string;
  day_type: "weekday" | "weekend" | "holiday";
  departure_time: string;
  arrival_time: string;
  status: "active" | "inactive";
  school_id: string;
}
