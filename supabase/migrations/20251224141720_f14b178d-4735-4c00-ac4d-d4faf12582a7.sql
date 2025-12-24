
-- Drop existing restrictive policies for products
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;

-- Create PERMISSIVE policy for public to view active products
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- Create PERMISSIVE policy for admins to view ALL products (including inactive)
CREATE POLICY "Admins can view all products" 
ON public.products 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create PERMISSIVE policy for admins to insert products
CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create PERMISSIVE policy for admins to update products
CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create PERMISSIVE policy for admins to delete products
CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Do the same for product_images
DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;

-- Public can view images of active products
CREATE POLICY "Anyone can view product images" 
ON public.product_images 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM products 
  WHERE products.id = product_images.product_id 
  AND products.is_active = true
));

-- Admins can view ALL product images
CREATE POLICY "Admins can view all product images" 
ON public.product_images 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert product images
CREATE POLICY "Admins can insert product images" 
ON public.product_images 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update product images
CREATE POLICY "Admins can update product images" 
ON public.product_images 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete product images
CREATE POLICY "Admins can delete product images" 
ON public.product_images 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));
