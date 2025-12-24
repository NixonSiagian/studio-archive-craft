import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { formatPrice } from '@/data/products';
import { Badge } from '@/components/ui/badge';

interface OrderItem {
  id: string;
  product_name: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  payment_status: string;
  fulfillment_status: string;
  total_price: number;
  created_at: string;
  order_items: OrderItem[];
}

const AccountOrders = () => {
  const { user, signOut } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['customer-orders', user?.id],
    queryFn: async () => {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);
          return { ...order, order_items: items || [] };
        })
      );

      return ordersWithItems as Order[];
    },
    enabled: !!user,
  });

  const getStatusBadge = (status: string, type: 'payment' | 'fulfillment') => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      paid: 'default',
      pending: 'secondary',
      failed: 'destructive',
      completed: 'default',
      shipped: 'secondary',
      processing: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Layout>
      <title>My Orders — WNM</title>
      
      <section className="py-section">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="heading-section">MY ORDERS</h1>
            <button 
              onClick={signOut}
              className="text-caption hover:text-foreground transition-colors"
            >
              SIGN OUT
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading your orders...</div>
          ) : orders?.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
              <h2 className="heading-product mb-4">NO ORDERS YET</h2>
              <p className="text-muted-foreground mb-8">Start shopping to see your orders here.</p>
              <Link to="/shop" className="btn-primary">
                SHOP NOW
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders?.map((order) => (
                <div key={order.id} className="border border-border p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="font-mono text-sm mb-1">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.payment_status, 'payment')}
                      {getStatusBadge(order.fulfillment_status, 'fulfillment')}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-caption">TOTAL</span>
                    <span className="font-display text-xl">{formatPrice(order.total_price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AccountOrders;
