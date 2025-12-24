import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartDrawer from '@/components/cart/CartDrawer';
import logoWnm from '@/assets/logo-wnm.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { href: '/shop', label: 'SHOP' },
    { href: '/archive', label: 'ARCHIVE' },
    { href: '/studio', label: 'STUDIO' },
    { href: '/contact', label: 'CONTACT' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getAccountLink = () => {
    if (!user) return '/auth';
    return '/account/orders';
  };

  const getAccountLabel = () => {
    if (!user) return 'SIGN IN';
    return 'ACCOUNT';
  };

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
              {navLinks.map(link => (
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
                {navLinks.map(link => (
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
