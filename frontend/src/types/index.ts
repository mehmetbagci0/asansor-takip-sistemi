// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'ADMIN' | 'TECHNICIAN' | 'CUSTOMER' | 'MANAGER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Elevator types
export interface Elevator {
  id: string;
  serialNumber: string;
  type: 'PASSENGER' | 'FREIGHT' | 'HYBRID';
  brand?: string;
  model?: string;
  capacity?: number;
  personCapacity?: number;
  floors?: number;
  yearInstalled?: number;
  ceNumber?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'FAULTY';
  qrCode?: string;
  notes?: string;
  building: Building;
  buildingId: string;
  createdAt: string;
  updatedAt: string;
}

// Building types
export interface Building {
  id: string;
  name: string;
  address: string;
  city?: string;
  district?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  company?: Company;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

// Company types
export interface Company {
  id: string;
  name: string;
  taxNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

// Maintenance types
export interface Maintenance {
  id: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  duration?: number;
  notes?: string;
  elevator: Elevator;
  elevatorId: string;
  technician?: User;
  technicianId?: string;
  checklistItems?: MaintenanceChecklistItem[];
  usedMaterials?: UsedMaterial[];
  technicianSignature?: string;
  customerSignature?: string;
  customerName?: string;
  createdAt: string;
  updatedAt: string;
}

// Checklist types
export interface MaintenanceChecklistItem {
  id: string;
  category: string;
  itemNumber: number;
  description: string;
  isCompliant?: boolean;
  notes?: string;
  photoUrl?: string;
  maintenanceId: string;
}

// Material types
export interface UsedMaterial {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  notes?: string;
  maintenanceId: string;
}

// Fault types
export interface Fault {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority?: string;
  reportedDate: string;
  resolvedDate?: string;
  resolution?: string;
  elevator: Elevator;
  elevatorId: string;
  assignedTo?: User;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
}

// Inspection types
export interface Inspection {
  id: string;
  inspectionDate: string;
  expiryDate: string;
  result?: string;
  inspectorName?: string;
  certificateNo?: string;
  notes?: string;
  documentUrl?: string;
  elevatorId: string;
  createdAt: string;
  updatedAt: string;
}
