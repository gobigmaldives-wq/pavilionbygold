-- Drop conflicting SELECT policies and consolidate into one clear policy
DROP POLICY IF EXISTS "Admins can view all bookings " ON public.bookings;
DROP POLICY IF EXISTS "Public cannot view bookings" ON public.bookings;

-- Create single clear SELECT policy: only authenticated admins can view bookings
CREATE POLICY "Only admins can view bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));