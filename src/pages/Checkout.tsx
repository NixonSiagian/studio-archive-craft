import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/products';
import { toast } from '@/components/ui/sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Indonesia'
  });

  const shippingCost = 25000; // 25K IDR
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    clearCart();
    toast.success('Order placed successfully');
    navigate('/order-confirmation');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <title>Checkout — WNM</title>
        <section className="py-section container mx-auto px-6 lg:px-12 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="heading-section mb-6">YOUR CART IS EMPTY</h1>
          <Link to="/shop" className="btn-outline">
            CONTINUE SHOPPING
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <title>Checkout — WNM</title>
      <meta name="description" content="Complete your WNM order." />

      <section className="py-section">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-caption mb-8 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={14} />
            BACK
          </button>

          <h1 className="heading-section mb-12">CHECKOUT</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Shipping Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-8">
                {/* Contact */}
                <div>
                  <h2 className="text-caption mb-6">CONTACT</h2>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-caption mb-6">SHIPPING ADDRESS</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      placeholder="First name"
                      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      placeholder="Last name"
                      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      placeholder="Phone"
                      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors md:col-span-2"
                    />
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                      required
                      placeholder="Address"
                      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors md:col-span-2"
                    />
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                      required
                      placeholder="City"
                      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                    <input
                      type="text"
                      value={shippingInfo.province}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, province: e.target.value }))}
                      required
                      placeholder="Province"
                      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                      required
                      placeholder="Postal code"
                      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                    <input
                      type="text"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, country: e.target.value }))}
                      required
                      placeholder="Country"
                      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-cream p-6 lg:p-8 lg:sticky lg:top-32">
                <h2 className="text-caption mb-6">ORDER SUMMARY</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  {items.map(item => (
                    <div key={`${item.product.id}-${item.size}`} className="flex justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-border mb-6">
                  <span className="text-caption">TOTAL</span>
                  <span className="font-display text-xl">{formatPrice(grandTotal)}</span>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className={`btn-primary w-full ${isSubmitting ? 'opacity-50' : ''}`}
                >
                  {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  This is a demo checkout. No payment will be processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
