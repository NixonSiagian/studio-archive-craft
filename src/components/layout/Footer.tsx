import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 md:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-4xl md:text-5xl tracking-tight font-light">
              WNM
            </Link>
            <p className="mt-4 text-caption text-background/60">
              A CLOTHING STUDIO
            </p>
            <p className="mt-6 text-sm text-background/50 max-w-sm font-light">
              Clothing as documentation. Each piece produced once, never restocked.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-caption text-background/60 mb-6">NAVIGATE</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/shop" className="text-sm hover:opacity-70 transition-opacity">Shop</Link>
              <Link to="/archive" className="text-sm hover:opacity-70 transition-opacity">Archive</Link>
              <Link to="/studio" className="text-sm hover:opacity-70 transition-opacity">Studio</Link>
              <Link to="/contact" className="text-sm hover:opacity-70 transition-opacity">Contact</Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-caption text-background/60 mb-6">CONNECT</h4>
            <nav className="flex flex-col gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm hover:opacity-70 transition-opacity"
              >
                Instagram
              </a>
              <a 
                href="mailto:studio@wnmwear.store"
                className="text-sm hover:opacity-70 transition-opacity"
              >
                studio@wnmwear.store
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-xs text-background/40">
            © 2025 WNM STUDIO. ALL RIGHTS RESERVED.
          </p>
          <p className="text-xs text-background/40">
            EST 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
