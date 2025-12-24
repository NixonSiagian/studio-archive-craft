import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, DollarSign, Clock, CheckCircle, Users, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatPrice } from '@/data/products';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_price, payment_status, fulfillment_status, created_at');

      if (ordersError) throw ordersError;

      // Fetch users count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Fetch products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (productsError) throw productsError;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, o) => sum + o.total_price, 0) || 0;
      const pendingOrders = orders?.filter(o => o.fulfillment_status === 'processing').length || 0;
      const completedOrders = orders?.filter(o => o.fulfillment_status === 'completed').length || 0;
      const todayOrders = orders?.filter(o => new Date(o.created_at) >= today).length || 0;

      return {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        todayOrders,
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
      };
    },
  });

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: Package,
      href: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
    },
    {
      title: 'Pending',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      href: '/admin/orders?fulfillment=processing',
    },
    {
      title: 'Products',
      value: stats?.totalProducts || 0,
      icon: ShoppingBag,
      href: '/admin/products',
    },
    {
      title: 'Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Completed',
      value: stats?.completedOrders || 0,
      icon: CheckCircle,
      href: '/admin/orders?fulfillment=completed',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <title>Admin Dashboard — WNM</title>

      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
            {statCards.map((stat) => {
              const content = (
                <div className="border border-border p-6 hover:border-foreground/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {stat.title}
                    </span>
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="font-display text-3xl tracking-tight">
                    {stat.value}
                  </div>
                </div>
              );

              return stat.href ? (
                <Link key={stat.title} to={stat.href}>
                  {content}
                </Link>
              ) : (
                <div key={stat.title}>{content}</div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Quick Actions
            </h2>
            <div className="flex gap-4">
              <Link
                to="/admin/orders"
                className="btn-primary"
              >
                VIEW ALL ORDERS
              </Link>
              <Link
                to="/admin/orders?fulfillment=processing"
                className="border border-border px-6 py-3 text-xs uppercase tracking-widest hover:border-foreground transition-colors"
              >
                PENDING ORDERS ({stats?.pendingOrders || 0})
              </Link>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="border border-border p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Today's Summary
            </h2>
            <p className="text-sm">
              <span className="font-display text-2xl mr-2">{stats?.todayOrders || 0}</span>
              <span className="text-muted-foreground">orders received today</span>
            </p>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
