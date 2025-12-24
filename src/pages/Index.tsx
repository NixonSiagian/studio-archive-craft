import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { products } from '@/data/products';
import heroModel from '@/assets/hero-model.jpg';

const Index = () => {
  const featuredProducts = products.filter(p => p.drop === 'archive-001').slice(0, 3);

  return (
    <Layout>
      {/* SEO */}
      <title>WNM — A Clothing Studio</title>
      <meta name="description" content="WNM is a clothing studio producing limited-run garments. Each piece documented, produced once, never restocked. EST 2025." />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#d4cfc7]">
        {/* Model Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={heroModel} 
            alt="Model wearing WNM Drake t-shirt"
            className="h-full w-auto max-w-full object-contain animate-fade-in"
          />
        </div>

        {/* Content - Bottom positioned */}
        <div className="absolute bottom-16 left-0 right-0 z-10 px-6 lg:px-12 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-sm tracking-[0.2em] font-light text-foreground/80 mb-4">
              CLOTHING AS DOCUMENTATION
            </h1>
            <Link 
              to="/shop" 
              className="inline-flex items-center text-xs tracking-[0.15em] text-foreground/60 hover:text-foreground transition-colors"
            >
              VIEW COLLECTION <ArrowRight size={12} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Drop Section */}
      <section className="py-section bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-caption mb-3">LATEST DROP</p>
              <h2 className="heading-section">ARCHIVE 001</h2>
            </div>
            <Link to="/shop" className="btn-ghost group">
              VIEW ALL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Statement */}
      <section className="py-hero bg-cream">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-caption mb-8">THE STUDIO</p>
            <blockquote className="heading-section font-light leading-relaxed mb-8">
              "We make clothes the way we make photographs. 
              Each piece is a document—produced once, never repeated."
            </blockquote>
            <Link to="/studio" className="btn-ghost">
              EXPLORE STUDIO <ArrowRight size={14} className="inline ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-section bg-background border-t border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-md mx-auto text-center">
            <p className="text-caption mb-4">ARCHIVE UPDATES</p>
            <p className="text-editorial text-muted-foreground mb-8">
              Be the first to know when new pieces drop.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                SUBSCRIBE
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
