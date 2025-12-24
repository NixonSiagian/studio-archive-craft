import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, ArrowUpDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
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

// Mask email: show first 3 chars + domain
const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  if (!domain) return '***@***';
  return `${local.slice(0, 3)}***@${domain}`;
};

// Mask phone: show last 4 digits
const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return `****${digits.slice(-4)}`;
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>(searchParams.get('payment') || 'all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>(searchParams.get('fulfillment') || 'all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

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

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let result = [...orders];

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(searchLower) ||
          o.customer_name.toLowerCase().includes(searchLower)
      );
    }

    // Payment status filter
    if (paymentFilter !== 'all') {
      result = result.filter((o) => o.payment_status === paymentFilter);
    }

    // Fulfillment status filter
    if (fulfillmentFilter !== 'all') {
      result = result.filter((o) => o.fulfillment_status === fulfillmentFilter);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [orders, search, paymentFilter, fulfillmentFilter, sortOrder]);

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

  const handleRowClick = (orderId: string) => {
    navigate(`/admin/order/${orderId}`);
  };

  return (
    <AdminLayout title="Orders">
      <title>Admin Orders — WNM</title>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or Customer Name"
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        {/* Payment Filter */}
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        {/* Fulfillment Filter */}
        <Select value={fulfillmentFilter} onValueChange={setFulfillmentFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Fulfillment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fulfillment</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <button
          onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          className="flex items-center gap-2 px-4 py-2 border border-border text-sm hover:border-foreground transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
      </p>

      {/* Table */}
      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {search || paymentFilter !== 'all' || fulfillmentFilter !== 'all'
            ? 'No orders match your filters'
            : 'No orders yet'}
        </div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs uppercase tracking-wider">Order ID</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Customer</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Phone</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-center">Items</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-right">Total</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Payment</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Fulfillment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => handleRowClick(order.id)}
                  className="cursor-pointer hover:bg-muted/20"
                >
                  <TableCell className="font-mono text-xs">
                    {order.order_number}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{order.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{maskEmail(order.customer_email)}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {maskPhone(order.customer_phone)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm">{order.order_items.length}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatPrice(order.total_price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPaymentBadgeVariant(order.payment_status)}>
                      {order.payment_status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getFulfillmentBadgeVariant(order.fulfillment_status)}>
                      {order.fulfillment_status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
