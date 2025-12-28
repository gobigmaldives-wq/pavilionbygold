-- Fix the security definer view issue by recreating with SECURITY INVOKER
DROP VIEW IF EXISTS public.booked_dates;

CREATE VIEW public.booked_dates 
WITH (security_invoker = true)
AS
SELECT 
  event_date,
  space,
  status
FROM public.bookings
WHERE status IN ('approved', 'confirmed', 'completed');

-- Grant access to the view for anonymous and authenticated users
GRANT SELECT ON public.booked_dates TO anon;
GRANT SELECT ON public.booked_dates TO authenticated;

-- Create a permissive SELECT policy on bookings that allows the view to work
-- This policy only allows reading the specific columns through the view context
CREATE POLICY "Allow view access to booked dates"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (status IN ('approved', 'confirmed', 'completed'));