-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'approved', 'confirmed', 'completed', 'cancelled', 'rejected');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'partial', 'paid', 'refunded');

-- Create enum for space type
CREATE TYPE public.space_type AS ENUM ('floor1', 'floor1_garden', 'floor2', 'entire_venue');

-- Create enum for event type
CREATE TYPE public.event_type AS ENUM ('wedding', 'corporate', 'private', 'ramadan', 'other');

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  event_type public.event_type NOT NULL,
  event_date DATE NOT NULL,
  space public.space_type NOT NULL,
  guest_count INTEGER NOT NULL,
  notes TEXT,
  status public.booking_status NOT NULL DEFAULT 'pending',
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  agreed_to_rules BOOLEAN NOT NULL DEFAULT false,
  agreed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for public to insert bookings (anyone can submit a booking request)
CREATE POLICY "Anyone can submit a booking request"
ON public.bookings
FOR INSERT
WITH CHECK (true);

-- Create policy for public to read confirmed/approved dates (for blocking calendar)
CREATE POLICY "Anyone can view booked dates"
ON public.bookings
FOR SELECT
USING (status IN ('approved', 'confirmed', 'completed'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster date queries
CREATE INDEX idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);