
-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own payment proofs
CREATE POLICY "Users can upload payment proofs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid() IS NOT NULL);

-- Allow users to view their own payment proofs
CREATE POLICY "Users can view own payment proofs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-proofs' AND auth.uid() IS NOT NULL);

-- Allow admins to view all payment proofs
CREATE POLICY "Admins can view all payment proofs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-proofs' AND has_role(auth.uid(), 'admin'::app_role));
