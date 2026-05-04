const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-background/80">
      <div className="container mx-auto px-6 lg:px-12 py-12 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight">Nixon Siagian</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              3D portfolio designer yang membangun pengalaman web liquid glass modern dengan
              Three.js, motion, dan storytelling visual.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <a href="#projects" className="hover:text-foreground transition-colors">
              Projects
            </a>
            <a href="#services" className="hover:text-foreground transition-colors">
              Services
            </a>
            <a href="mailto:hello@nixonstudio.io" className="hover:text-foreground transition-colors">
              Email
            </a>
            <a href="https://www.behance.net" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              Behance
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between text-xs text-muted-foreground">
          <span>© 2026 Nixon Studio. All rights reserved.</span>
          <span>Crafted in Jakarta • Remote worldwide</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
