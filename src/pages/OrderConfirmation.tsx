import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  return (
    <Layout>
      <title>Order Confirmed — WNM</title>
      
      <section className="py-section min-h-[70vh] flex items-center">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-8">
              <CheckCircle size={48} strokeWidth={1} className="text-foreground" />
            </div>
            
            <p className="text-caption mb-4">ORDER CONFIRMED</p>
            <h1 className="heading-section mb-6">THANK YOU</h1>
            <p className="text-editorial text-muted-foreground mb-8">
              Your order has been received. We'll send you a confirmation email with tracking details once your order ships.
            </p>

            <div className="space-y-3">
              <Link to="/shop" className="btn-primary w-full inline-block text-center">
                CONTINUE SHOPPING
              </Link>
              <Link to="/" className="btn-ghost block">
                RETURN HOME
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderConfirmation;
