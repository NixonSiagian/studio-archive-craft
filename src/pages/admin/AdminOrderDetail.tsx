import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatPrice } from '@/data/products';
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
  product_id: string;
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
  updated_at: string;
  order_items: OrderItem[];
}

const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (orderError) throw orderError;
      if (!orderData) throw new Error('Order not found');

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      const fullOrder = { ...orderData, order_items: items || [] } as Order;
      
      // Initialize form state
      setPaymentStatus(fullOrder.payment_status);
      setFulfillmentStatus(fullOrder.fulfillment_status);
      
      return fullOrder;
    },
  });

  const updateOrder = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          fulfillment_status: fulfillmentStatus,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setHasChanges(false);
      toast.success('Order updated successfully');
    },
    onError: () => {
      toast.error('Failed to update order');
    },
  });

  const handleStatusChange = (type: 'payment' | 'fulfillment', value: string) => {
    if (type === 'payment') {
      setPaymentStatus(value);
    } else {
      setFulfillmentStatus(value);
    }
    setHasChanges(true);
  };

  const handleSave = () => {
    updateOrder.mutate();
  };

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

  if (isLoading) {
    return (
      <AdminLayout title="Loading...">
        <div className="text-muted-foreground text-sm">Loading order details...</div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout title="Order Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">This order could not be found.</p>
          <button onClick={() => navigate('/admin/orders')} className="btn-primary">
            BACK TO ORDERS
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Order ${order.order_number}`}>
      <title>{order.order_number} — WNM Admin</title>

      {/* Back button */}
      <button
        onClick={() => navigate('/admin/orders')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <section className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="text-sm">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                <p className="text-sm">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Order Date</p>
                <p className="text-sm">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-1">Shipping Address</p>
              <p className="text-sm whitespace-pre-line">{order.shipping_address}</p>
            </div>
          </section>

          {/* Order Items */}
          <section className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-mono text-sm">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
              <span className="text-xs uppercase tracking-widest">Total</span>
              <span className="font-display text-xl">{formatPrice(order.total_price)}</span>
            </div>
          </section>

          {/* Internal Notes */}
          <section className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Internal Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this order..."
              className="w-full h-32 px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Notes are for internal use only and are not saved to the database yet.
            </p>
          </section>
        </div>

        {/* Right Column - Status Updates */}
        <div className="space-y-6">
          {/* Status Card */}
          <section className="border border-border p-6 sticky top-8">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Order Status
            </h2>

            {/* Payment Status */}
            <div className="mb-6">
              <label className="text-xs text-muted-foreground mb-2 block">
                Payment Status
              </label>
              <Select
                value={paymentStatus}
                onValueChange={(value) => handleStatusChange('payment', value)}
              >
                <SelectTrigger className="w-full">
                  <Badge variant={getPaymentBadgeVariant(paymentStatus)}>
                    {paymentStatus.toUpperCase()}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fulfillment Status */}
            <div className="mb-6">
              <label className="text-xs text-muted-foreground mb-2 block">
                Fulfillment Status
              </label>
              <Select
                value={fulfillmentStatus}
                onValueChange={(value) => handleStatusChange('fulfillment', value)}
              >
                <SelectTrigger className="w-full">
                  <Badge variant={getFulfillmentBadgeVariant(fulfillmentStatus)}>
                    {fulfillmentStatus.toUpperCase()}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!hasChanges || updateOrder.isPending}
              className={`w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest transition-colors ${
                hasChanges
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {updateOrder.isPending ? 'SAVING...' : 'SAVE CHANGES'}
            </button>

            {hasChanges && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                You have unsaved changes
              </p>
            )}
          </section>

          {/* Order Meta */}
          <section className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Order Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono text-xs">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{new Date(order.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetail;
