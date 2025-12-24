import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import AdminErrorBoundary from './AdminErrorBoundary';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const navItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Orders', href: '/admin/orders', icon: Package },
  { title: 'Products', href: '/admin/products', icon: ShoppingBag },
  { title: 'Users', href: '/admin/users', icon: Users },
];

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, isAdmin, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { state: { from: location }, replace: true });
    }
  }, [user, loading, navigate, location]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm tracking-widest uppercase">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <h1 className="text-2xl font-display tracking-tight mb-4">ACCESS DENIED</h1>
        <p className="text-muted-foreground text-sm mb-8 text-center max-w-md">
          You do not have permission to access the admin area.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          RETURN HOME
        </button>
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen flex bg-background">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border bg-background flex flex-col transform transition-transform duration-200 ease-in-out',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <div className="flex items-center">
              <Link to="/" className="font-display text-xl tracking-tight">
                WNM
              </Link>
              <span className="ml-2 text-xs text-muted-foreground uppercase tracking-widest">Admin</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 -mr-2 hover:bg-muted/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  isActive(item.href)
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="uppercase tracking-wider text-xs">{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span className="uppercase tracking-wider text-xs">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center px-4 lg:px-8 sticky top-0 bg-background z-30">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 mr-2 hover:bg-muted/50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb on mobile */}
            <div className="flex items-center gap-2 lg:hidden text-sm">
              <span className="text-muted-foreground">Admin</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="font-medium truncate">{title}</span>
            </div>
            
            {/* Title on desktop */}
            <h1 className="hidden lg:block font-display text-lg tracking-tight uppercase">{title}</h1>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminLayout;
