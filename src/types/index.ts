
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  avatar: string;
  availability: TimeSlot[];
  fee: number;
  schedule?: DoctorSchedule;
  isActive: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  isEmergency?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  reason: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'in-progress';
  queueNumber: number;
  notes?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory: MedicalRecord[];
  totalVisits: number;
  lastVisit?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  appointmentId: string;
  date: string;
  doctor: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}

export interface Review {
  id: string;
  doctorId: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface NotificationPreference {
  sms: boolean;
  email: boolean;
  push: boolean;
  reminderTime: '1hour' | '2hours' | '1day';
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'patient' | 'admin' | 'doctor';
  email?: string;
  isActive: boolean;
}

export interface DoctorSchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface ClinicStats {
  totalPatients: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  revenue: number;
  averageWaitTime: number;
}
