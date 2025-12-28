-- Drop the view that won't work without a policy
DROP VIEW IF EXISTS public.booked_dates;

-- Create a security definer function to get anonymized booked dates
-- This function runs with elevated privileges but only returns non-PII data
CREATE OR REPLACE FUNCTION public.get_booked_dates()
RETURNS TABLE (
  event_date date,
  space text,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    event_date,
    space::text,
    status::text
  FROM public.bookings
  WHERE status IN ('approved', 'confirmed', 'completed');
$$;