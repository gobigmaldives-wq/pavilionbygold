-- Add explicit deny policy for public/anonymous users viewing bookings
CREATE POLICY "Public cannot view bookings"
ON public.bookings
FOR SELECT
TO anon
USING (false);