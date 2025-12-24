import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { formatPrice } from '@/data/products';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';

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
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_status: 'pending' | 'paid' | 'failed';
  fulfillment_status: 'processing' | 'shipped' | 'completed';
  total_price: number;
  created_at: string;
  order_items: OrderItem[];
}

const Admin = () => {
  const queryClient = useQueryClient();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

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
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Payment status updated');
    },
    onError: () => {
      toast.error('Failed to update payment status');
    },
  });

  const updateFulfillmentStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ fulfillment_status: status })
        .eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Fulfillment status updated');
    },
    onError: () => {
      toast.error('Failed to update fulfillment status');
    },
  });

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getFulfillmentBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'shipped': return 'secondary';
      case 'processing': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Layout>
      <title>Admin Orders — WNM</title>
      <section className="py-section">
        <div className="container mx-auto px-6 lg:px-12">
          <h1 className="heading-section mb-12">ORDER DASHBOARD</h1>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading orders...</div>
          ) : orders?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-caption">ORDER ID</TableHead>
                    <TableHead className="text-caption">CUSTOMER</TableHead>
                    <TableHead className="text-caption">CONTACT</TableHead>
                    <TableHead className="text-caption">PRODUCTS</TableHead>
                    <TableHead className="text-caption">TOTAL</TableHead>
                    <TableHead className="text-caption">PAYMENT</TableHead>
                    <TableHead className="text-caption">FULFILLMENT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="hover:underline text-left"
                        >
                          {order.order_number}
                        </button>
                        {expandedOrder === order.id && (
                          <div className="mt-2 p-3 bg-cream text-xs space-y-1">
                            <p><strong>Address:</strong> {order.shipping_address}</p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{order.customer_name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>{order.customer_email}</div>
                          <div className="text-muted-foreground">{order.customer_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          {order.order_items.map((item) => (
                            <div key={item.id}>
                              {item.product_name} ({item.size}) × {item.quantity}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatPrice(order.total_price)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.payment_status}
                          onValueChange={(value) => 
                            updatePaymentStatus.mutate({ orderId: order.id, status: value })
                          }
                        >
                          <SelectTrigger className="w-[120px] h-8">
                            <Badge variant={getPaymentBadgeVariant(order.payment_status)}>
                              {order.payment_status.toUpperCase()}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.fulfillment_status}
                          onValueChange={(value) => 
                            updateFulfillmentStatus.mutate({ orderId: order.id, status: value })
                          }
                        >
                          <SelectTrigger className="w-[130px] h-8">
                            <Badge variant={getFulfillmentBadgeVariant(order.fulfillment_status)}>
                              {order.fulfillment_status.toUpperCase()}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
