
-- Add payment proof fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_proof_url text,
ADD COLUMN IF NOT EXISTS payment_sender_name text,
ADD COLUMN IF NOT EXISTS payment_last4 text,
ADD COLUMN IF NOT EXISTS internal_notes text;
