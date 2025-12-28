-- Drop the policy that exposes PII publicly
DROP POLICY IF EXISTS "Anyone can view booked dates" ON public.bookings;

-- Create a view that only exposes anonymized booking data for calendar availability
CREATE OR REPLACE VIEW public.booked_dates AS
SELECT 
  event_date,
  space,
  status
FROM public.bookings
WHERE status IN ('approved', 'confirmed', 'completed');

-- Grant access to the view for anonymous and authenticated users
GRANT SELECT ON public.booked_dates TO anon;
GRANT SELECT ON public.booked_dates TO authenticated;