
-- Update the get_next_queue_number function to be more specific per doctor and date
CREATE OR REPLACE FUNCTION public.get_next_queue_number(appointment_date date, doctor_id text)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(queue_number), 0) + 1 
  INTO next_number
  FROM public.appointments 
  WHERE appointment_date = $1 AND doctor_id = $2;
  
  RETURN next_number;
END;
$function$;

-- Update the trigger function to use doctor_id as well
CREATE OR REPLACE FUNCTION public.assign_queue_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.queue_number IS NULL OR NEW.queue_number = 0 THEN
    NEW.queue_number := get_next_queue_number(NEW.appointment_date, NEW.doctor_id);
  END IF;
  RETURN NEW;
END;
$function$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS assign_queue_number_trigger ON public.appointments;
CREATE TRIGGER assign_queue_number_trigger
  BEFORE INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION assign_queue_number();

-- Enable RLS on appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admin can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admin can update all appointments" ON public.appointments;

-- Create RLS policies for appointments
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

-- Admin policies (assuming admin users have a specific role or email)
CREATE POLICY "Admin can view all appointments" 
  ON public.appointments 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@docbook.com'
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
      AND auth.users.email = 'admin@docbook.com'
    )
  );
