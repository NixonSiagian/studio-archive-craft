-- WARN fixes

-- 1) order_items: explicitly restrict UPDATE to admins only
DROP POLICY IF EXISTS "Admins can update order items" ON public.order_items;
CREATE POLICY "Admins can update order items"
ON public.order_items
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2) profiles: explicitly disallow DELETE for everyone (documents intent)
DROP POLICY IF EXISTS "No one can delete profiles" ON public.profiles;
CREATE POLICY "No one can delete profiles"
ON public.profiles
FOR DELETE
USING (false);