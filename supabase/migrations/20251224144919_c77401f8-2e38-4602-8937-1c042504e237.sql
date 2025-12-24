-- Create stock validation function and trigger for order items
CREATE OR REPLACE FUNCTION public.validate_and_decrement_stock()
RETURNS TRIGGER AS $$
DECLARE
  v_product RECORD;
  v_current_stock INT;
BEGIN
  -- Get product by ID or slug
  SELECT id, name, stock_by_size INTO v_product
  FROM products
  WHERE id::text = NEW.product_id OR slug = NEW.product_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found: %', NEW.product_id;
  END IF;
  
  -- Get current stock for the size
  v_current_stock := COALESCE((v_product.stock_by_size->>NEW.size)::int, 0);
  
  -- Check if enough stock
  IF v_current_stock < NEW.quantity THEN
    RAISE EXCEPTION 'Insufficient stock for % size %. Available: %, Requested: %', 
      v_product.name, NEW.size, v_current_stock, NEW.quantity;
  END IF;
  
  -- Decrement stock atomically
  UPDATE products
  SET stock_by_size = jsonb_set(
    stock_by_size,
    ARRAY[NEW.size],
    to_jsonb(v_current_stock - NEW.quantity)
  )
  WHERE id = v_product.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to validate stock before inserting order items
DROP TRIGGER IF EXISTS validate_stock_before_order_item ON order_items;
CREATE TRIGGER validate_stock_before_order_item
BEFORE INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION validate_and_decrement_stock();