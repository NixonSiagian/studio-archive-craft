import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-2xl">
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-gradient-to-tr from-cyan-300 via-sky-200 to-violet-300 shadow-[0_0_18px_rgba(124,247,241,0.6)]" />
            <span className="text-xs md:text-sm uppercase tracking-[0.4em] font-semibold">
              NIXON STUDIO
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="#contact" className="btn-liquid">
              Start Project
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="md:hidden p-2 -mr-2 text-foreground"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden pb-8 pt-4 border-t border-white/10 animate-fade-in"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a href="#contact" onClick={handleNavClick} className="btn-liquid w-fit">
                Start Project
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
