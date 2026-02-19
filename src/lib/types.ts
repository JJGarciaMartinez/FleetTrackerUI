export type StatusVehicle = 'active' | 'maintenance' | 'inactive'
export type VehicleType = 'van' | 'truck'

export interface Vehicle {
  id: number
  plate: string
  make: string
  model: string
  year: number
  type: VehicleType
  status: StatusVehicle
  currentLocation: {
    latitude: number
    longitude: number
    address: string
  }
  fuelLevel: number
  mileage: number
  assignedDriverId: number | null
  lastMaintenance: string
  createdAt: string
  updatedAt: string
}

export type StatusDriver = 'active' | 'available'
export type LicenseType = 'B' | 'C'

export interface Driver {
  id: number
  name: string
  phone: string
  email: string
  licenseType: LicenseType
  status: StatusDriver
  assignedVehicleId: number | null
  createdAt: string
  updatedAt: string
}

export type RouteStatus = 'completed' | 'in_progress' | 'pending'

export interface Route {
  id: number
  name: string
  vehicleId: number
  driverId: number
  origin: {
    latitude: number
    longitude: number
    address: string
  }
  destination: {
    latitude: number
    longitude: number
    address: string
  }
  distance: number
  estimatedDuration: number
  status: RouteStatus
  startTime: string | null
  endTime: string | null
  createdAt: string
  updatedAt: string
}

export type AlertType =
  | 'maintenance'
  | 'low_fuel'
  | 'speed'
  | 'geofence'
  | 'engine'
export type AlertSeverity = 'high' | 'medium' | 'low'

export interface Alert {
  id: number
  vehicleId: number
  type: AlertType
  severity: AlertSeverity
  message: string
  timestamp: string
  read: boolean
}
