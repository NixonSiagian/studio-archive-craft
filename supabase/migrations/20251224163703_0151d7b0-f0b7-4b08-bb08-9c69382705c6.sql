-- Fix 1: Restrict storage policy to only allow order owners to view their payment proofs
DROP POLICY IF EXISTS "Users can view own payment proofs" ON storage.objects;

CREATE POLICY "Users can view own payment proofs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment-proofs' 
  AND (
    -- Allow if user owns the order (order_id is first part of filename)
    auth.uid() IN (
      SELECT user_id FROM public.orders 
      WHERE id::text = split_part(name, '-', 1)
    )
    -- Or is admin
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Fix 2: Make orders.user_id NOT NULL (guest checkout not supported)
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;