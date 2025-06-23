
-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create expanded doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialty TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  qualification TEXT,
  experience_years INTEGER DEFAULT 0,
  consultation_fee INTEGER DEFAULT 500,
  rating DECIMAL(3,2) DEFAULT 0.0,
  avatar_url TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  availability JSONB, -- Store weekly schedule
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create appointment types table
CREATE TABLE public.appointment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  fee INTEGER DEFAULT 500,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create patient medical records table
CREATE TABLE public.patient_medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id),
  doctor_id UUID REFERENCES public.doctors(id),
  diagnosis TEXT,
  prescription TEXT,
  notes TEXT,
  files JSONB, -- Array of file URLs
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create reviews and ratings table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id),
  appointment_id UUID REFERENCES public.appointments(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error
  is_read BOOLEAN DEFAULT false,
  data JSONB, -- Additional data for the notification
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT, -- card, upi, cash
  payment_gateway TEXT, -- razorpay, stripe
  gateway_payment_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, success, failed, refunded
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create clinic settings table
CREATE TABLE public.clinic_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Update appointments table with new fields
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS appointment_type_id UUID REFERENCES public.appointment_types(id),
ADD COLUMN IF NOT EXISTS actual_doctor_id UUID REFERENCES public.doctors(id),
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS actual_start_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS actual_end_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS is_emergency BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS patient_age INTEGER,
ADD COLUMN IF NOT EXISTS patient_gender TEXT,
ADD COLUMN IF NOT EXISTS symptoms TEXT;

-- Enable RLS on new tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for departments (public read)
CREATE POLICY "Anyone can view active departments" ON public.departments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage departments" ON public.departments
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email = 'admin@docbook.com' OR 
        auth.users.email = 'abdultalha080103@gmail.com' OR
        (auth.users.raw_user_meta_data ->> 'name') = 'Admin'
      )
    )
  );

-- Create RLS policies for doctors (public read for active doctors)
CREATE POLICY "Anyone can view active doctors" ON public.doctors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage doctors" ON public.doctors
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email = 'admin@docbook.com' OR 
        auth.users.email = 'abdultalha080103@gmail.com' OR
        (auth.users.raw_user_meta_data ->> 'name') = 'Admin'
      )
    )
  );

-- Create RLS policies for appointment types (public read)
CREATE POLICY "Anyone can view active appointment types" ON public.appointment_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage appointment types" ON public.appointment_types
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email = 'admin@docbook.com' OR 
        auth.users.email = 'abdultalha080103@gmail.com' OR
        (auth.users.raw_user_meta_data ->> 'name') = 'Admin'
      )
    )
  );

-- Create RLS policies for medical records
CREATE POLICY "Users can view their own medical records" ON public.patient_medical_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all medical records" ON public.patient_medical_records
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email = 'admin@docbook.com' OR 
        auth.users.email = 'abdultalha080103@gmail.com' OR
        (auth.users.raw_user_meta_data ->> 'name') = 'Admin'
      )
    )
  );

CREATE POLICY "Admin can manage medical records" ON public.patient_medical_records
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email = 'admin@docbook.com' OR 
        auth.users.email = 'abdultalha080103@gmail.com' OR
        (auth.users.raw_user_meta_data ->> 'name') = 'Admin'
      )
    )
  );

-- Create RLS policies for reviews
CREATE POLICY "Users can view all reviews" ON public.reviews
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create their own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all reviews" ON public.reviews
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email = 'admin@docbook.com' OR 
        auth.users.email = 'abdultalha080103@gmail.com' OR
        (auth.users.raw_user_meta_data ->> 'name') = 'Admin'
      )
    )
  );

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can create notifications for any user" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email = 'admin@docbook.com' OR 
        auth.users.email = 'abdultalha080103@gmail.com' OR
        (auth.users.raw_user_meta_data ->> 'name') = 'Admin'
      )
    )
  );

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all payments" ON public.payments
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email = 'admin@docbook.com' OR 
        auth.users.email = 'abdultalha080103@gmail.com' OR
        (auth.users.raw_user_meta_data ->> 'name') = 'Admin'
      )
    )
  );

CREATE POLICY "Admin can manage payments" ON public.payments
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email = 'admin@docbook.com' OR 
        auth.users.email = 'abdultalha080103@gmail.com' OR
        (auth.users.raw_user_meta_data ->> 'name') = 'Admin'
      )
    )
  );

-- Create RLS policies for clinic settings (admin only)
CREATE POLICY "Admin can manage clinic settings" ON public.clinic_settings
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email = 'admin@docbook.com' OR 
        auth.users.email = 'abdultalha080103@gmail.com' OR
        (auth.users.raw_user_meta_data ->> 'name') = 'Admin'
      )
    )
  );

-- Insert sample data
INSERT INTO public.departments (name, description) VALUES
('General Medicine', 'Primary healthcare and general consultations'),
('Cardiology', 'Heart and cardiovascular system'),
('Dermatology', 'Skin, hair, and nail conditions'),
('Orthopedics', 'Bone, joint, and muscle disorders'),
('Pediatrics', 'Healthcare for children'),
('Gynecology', 'Women''s reproductive health');

INSERT INTO public.appointment_types (name, duration_minutes, fee, color) VALUES
('General Consultation', 30, 500, '#3B82F6'),
('Follow-up Visit', 20, 300, '#10B981'),
('Emergency Consultation', 45, 800, '#EF4444'),
('Specialist Consultation', 45, 800, '#8B5CF6'),
('Health Checkup', 60, 1000, '#F59E0B');

INSERT INTO public.doctors (name, email, phone, specialty, department_id, qualification, experience_years, consultation_fee, bio, availability) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@docbook.com', '+91-9876543210', 'General Medicine', 
 (SELECT id FROM public.departments WHERE name = 'General Medicine'), 
 'MBBS, MD Internal Medicine', 8, 500, 
 'Experienced general physician with expertise in preventive healthcare and chronic disease management.',
 '{"monday": [{"start": "09:00", "end": "17:00"}], "tuesday": [{"start": "09:00", "end": "17:00"}], "wednesday": [{"start": "09:00", "end": "17:00"}], "thursday": [{"start": "09:00", "end": "17:00"}], "friday": [{"start": "09:00", "end": "17:00"}], "saturday": [{"start": "09:00", "end": "13:00"}]}'),

('Dr. Michael Chen', 'michael.chen@docbook.com', '+91-9876543211', 'Cardiology', 
 (SELECT id FROM public.departments WHERE name = 'Cardiology'), 
 'MBBS, MD Cardiology, DM', 12, 800, 
 'Senior cardiologist specializing in interventional cardiology and heart disease prevention.',
 '{"monday": [{"start": "10:00", "end": "16:00"}], "tuesday": [{"start": "10:00", "end": "16:00"}], "wednesday": [{"start": "10:00", "end": "16:00"}], "thursday": [{"start": "10:00", "end": "16:00"}], "friday": [{"start": "10:00", "end": "16:00"}]}'),

('Dr. Priya Sharma', 'priya.sharma@docbook.com', '+91-9876543212', 'Dermatology', 
 (SELECT id FROM public.departments WHERE name = 'Dermatology'), 
 'MBBS, MD Dermatology', 6, 600, 
 'Dermatologist with expertise in cosmetic dermatology and skin cancer treatment.',
 '{"monday": [{"start": "11:00", "end": "18:00"}], "wednesday": [{"start": "11:00", "end": "18:00"}], "friday": [{"start": "11:00", "end": "18:00"}], "saturday": [{"start": "09:00", "end": "15:00"}]}');

-- Insert default clinic settings
INSERT INTO public.clinic_settings (key, value, description) VALUES
('clinic_name', '"DocBook Clinic"', 'Name of the clinic'),
('clinic_address', '"123 Health Street, Medical District, City - 123456"', 'Clinic address'),
('clinic_phone', '"+91-123-456-7890"', 'Clinic contact number'),
('clinic_email', '"info@docbook.com"', 'Clinic email address'),
('working_hours', '{"start": "09:00", "end": "18:00"}', 'Default working hours'),
('appointment_slot_duration', '30', 'Default appointment duration in minutes'),
('advance_booking_days', '30', 'How many days in advance patients can book'),
('cancellation_policy', '"Appointments can be cancelled up to 2 hours before the scheduled time"', 'Cancellation policy text');
