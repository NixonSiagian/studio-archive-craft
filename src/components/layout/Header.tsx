import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartDrawer from '@/components/cart/CartDrawer';
import logoWnm from '@/assets/logo-wnm.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAdmin, loading, role } = useAuth();
  const location = useLocation();

  // Debug logging (remove after verification)
  console.log('[Header] Auth State:', { 
    email: user?.email, 
    role, 
    isAdmin, 
    loading 
  });

  const publicNavLinks = [
    { href: '/shop', label: 'SHOP' },
    { href: '/archive', label: 'ARCHIVE' },
    { href: '/studio', label: 'STUDIO' },
    { href: '/contact', label: 'CONTACT' },
  ];

  const adminNavLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/users', label: 'Users' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isAdminActive = () => location.pathname.startsWith('/admin');

  const getAccountLink = () => {
    if (!user) return '/auth';
    return '/account/orders';
  };

  const getAccountLabel = () => {
    if (!user) return 'SIGN IN';
    return 'ACCOUNT';
  };

  // Don't render navigation links while auth is loading
  const showAdminMenu = !loading && isAdmin;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
        <nav className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="hover:opacity-70 transition-opacity duration-300"
            >
              <img 
                src={logoWnm} 
                alt="WNM" 
                className="h-10 md:h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {publicNavLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-caption link-underline ${
                    isActive(link.href) ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  } transition-opacity duration-300`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Admin Dropdown - Only visible to admins after auth resolves */}
              {showAdminMenu && (
                <DropdownMenu>
                  <DropdownMenuTrigger className={`text-caption link-underline flex items-center gap-1 ${
                    isAdminActive() ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  } transition-opacity duration-300`}>
                    ADMIN
                    <ChevronDown size={12} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border">
                    {adminNavLinks.map(link => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link
                          to={link.href}
                          className={`w-full cursor-pointer ${
                            isActive(link.href) ? 'bg-muted' : ''
                          }`}
                        >
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Account, Cart & Mobile Menu */}
            <div className="flex items-center gap-6">
              <Link
                to={getAccountLink()}
                className="hidden md:flex items-center gap-2 text-caption link-underline opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                <User size={14} />
                {getAccountLabel()}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="text-caption link-underline relative"
              >
                CART
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-4 w-5 h-5 bg-foreground text-background text-[10px] flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 -mr-2"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-8 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-6">
                {publicNavLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-caption ${
                      isActive(link.href) ? 'opacity-100' : 'opacity-70'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Admin links for mobile - Only visible to admins after auth resolves */}
                {showAdminMenu && (
                  <>
                    <div className="border-t border-border pt-4 mt-2">
                      <span className="text-caption text-muted-foreground text-xs">ADMIN</span>
                    </div>
                    {adminNavLinks.map(link => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-caption ${
                          isActive(link.href) ? 'opacity-100' : 'opacity-70'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </>
                )}

                <Link
                  to={getAccountLink()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-caption opacity-70 flex items-center gap-2"
                >
                  <User size={14} />
                  {getAccountLabel()}
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <CartDrawer />
    </>
  );
};

export default Header;
