import { Link } from 'react-router-dom';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/products';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const CartDrawer = () => {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity,
    totalPrice 
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background border-l border-border p-0 flex flex-col">
        <SheetHeader className="px-6 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-caption">CART ({items.length})</SheetTitle>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 -mr-2 hover:opacity-70 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-6">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={() => setIsCartOpen(false)}
                className="btn-outline"
              >
                VIEW COLLECTION
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {items.map((item) => {
                  const primaryImage = item.product.images?.[0];
                  
                  return (
                    <div 
                      key={`${item.product.id}-${item.size}`}
                      className="flex gap-4"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-28 bg-muted flex-shrink-0 overflow-hidden p-2">
                        {primaryImage ? (
                          <img 
                            src={primaryImage}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<span class="text-[8px] text-muted-foreground tracking-widest uppercase w-full h-full flex items-center justify-center text-center">IMAGE PENDING</span>';
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[8px] text-muted-foreground tracking-widest uppercase text-center">IMAGE PENDING</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="heading-product text-sm">{item.product.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Size: {item.size}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                              className="p-1 hover:opacity-70 transition-opacity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                              className="p-1 hover:opacity-70 transition-opacity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="text-sm">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="self-start p-1 hover:opacity-70 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart Footer */}
            <div className="px-6 py-6 border-t border-border space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-caption">SUBTOTAL</span>
                <span className="font-display text-lg">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping calculated at checkout
              </p>
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="btn-primary w-full text-center"
              >
                CHECKOUT
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
