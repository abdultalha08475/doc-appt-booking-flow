
-- Fix RLS policies for appointments table to allow admin access
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admin can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admin can update all appointments" ON public.appointments;

-- Create RLS policies for regular users
CREATE POLICY "Users can view their own appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create admin policies that allow access to all appointments
CREATE POLICY "Admin can view all appointments" 
  ON public.appointments 
  FOR SELECT 
  TO authenticated
  USING (
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

CREATE POLICY "Admin can update all appointments" 
  ON public.appointments 
  FOR UPDATE 
  TO authenticated
  USING (
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

CREATE POLICY "Admin can insert all appointments" 
  ON public.appointments 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
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
