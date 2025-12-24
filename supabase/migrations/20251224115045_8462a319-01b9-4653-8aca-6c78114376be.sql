-- Fix function search path for generate_order_number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'WNM-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTR(NEW.id::text, 1, 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;