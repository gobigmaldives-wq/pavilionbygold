-- Create storage bucket for transfer slips
INSERT INTO storage.buckets (id, name, public) VALUES ('transfer-slips', 'transfer-slips', false);

-- Allow anyone to upload transfer slips (no auth required for booking)
CREATE POLICY "Anyone can upload transfer slips"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'transfer-slips');

-- Only admins can view/download transfer slips
CREATE POLICY "Admins can view transfer slips"
ON storage.objects
FOR SELECT
USING (bucket_id = 'transfer-slips' AND has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete transfer slips
CREATE POLICY "Admins can delete transfer slips"
ON storage.objects
FOR DELETE
USING (bucket_id = 'transfer-slips' AND has_role(auth.uid(), 'admin'::app_role));

-- Add transfer_slip_url column to bookings table
ALTER TABLE public.bookings ADD COLUMN transfer_slip_url TEXT;