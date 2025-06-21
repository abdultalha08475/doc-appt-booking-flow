
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  avatar: string;
  availability: TimeSlot[];
  fee: number;
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
  date: string;
  time: string;
  reason: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  queueNumber: number;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
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
