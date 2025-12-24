-- Admin-only DELETE for order_items (controlled remediation)
CREATE POLICY "Only admins can delete order items"
ON public.order_items
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Server-side validation for orders fields (trigger-based; no CHECK constraints)
CREATE OR REPLACE FUNCTION public.validate_order_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  email_re constant text := '^[^\s@]+@[^\s@]+\.[^\s@]+$';
  phone_re constant text := '^[+0-9\s()\-]{8,30}$';
BEGIN
  IF NEW.customer_name IS NULL OR length(btrim(NEW.customer_name)) < 1 OR length(NEW.customer_name) > 200 THEN
    RAISE EXCEPTION 'Invalid customer_name';
  END IF;

  IF NEW.customer_email IS NULL OR length(btrim(NEW.customer_email)) < 3 OR length(NEW.customer_email) > 255 OR NEW.customer_email !~ email_re THEN
    RAISE EXCEPTION 'Invalid customer_email';
  END IF;

  IF NEW.customer_phone IS NULL OR length(btrim(NEW.customer_phone)) < 8 OR length(NEW.customer_phone) > 30 OR NEW.customer_phone !~ phone_re THEN
    RAISE EXCEPTION 'Invalid customer_phone';
  END IF;

  IF NEW.shipping_address IS NULL OR length(btrim(NEW.shipping_address)) < 5 OR length(NEW.shipping_address) > 500 THEN
    RAISE EXCEPTION 'Invalid shipping_address';
  END IF;

  IF NEW.payment_status IS NULL OR length(NEW.payment_status) > 50 THEN
    RAISE EXCEPTION 'Invalid payment_status';
  END IF;

  IF NEW.fulfillment_status IS NULL OR length(NEW.fulfillment_status) > 50 THEN
    RAISE EXCEPTION 'Invalid fulfillment_status';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_orders_before_write ON public.orders;
CREATE TRIGGER validate_orders_before_write
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.validate_order_fields();