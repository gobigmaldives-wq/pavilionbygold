-- Remove duplicate SELECT policy (keeping only "Only admins can view bookings")
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;