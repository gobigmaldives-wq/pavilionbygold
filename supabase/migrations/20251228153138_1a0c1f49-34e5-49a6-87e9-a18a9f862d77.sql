-- Remove the policy that still exposes full booking rows including PII
DROP POLICY IF EXISTS "Allow view access to booked dates" ON public.bookings;