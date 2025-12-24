import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { drops, products } from '@/data/products';
import studioImage from '@/assets/studio-image.jpg';

const Archive = () => {
  return (
    <Layout>
      <title>Archive — WNM</title>
      <meta name="description" content="The WNM Archive. A timeline of drops documenting our clothing studio's journey since 2025." />

      {/* Hero */}
      <section className="py-section bg-cream">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-caption mb-4">THE ARCHIVE</p>
          <h1 className="heading-hero mb-6">ARCHIVE DROPS</h1>
          <p className="text-editorial text-muted-foreground max-w-lg mx-auto">
            A timeline of everything we've made. Each drop documented, produced once, never repeated.
          </p>
        </div>
      </section>

      {/* Archive Timeline */}
      <section className="py-section">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="space-y-24">
            {drops.map((drop, index) => {
              const dropProducts = products.filter(p => p.drop === drop.id);
              
              return (
                <div 
                  key={drop.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Drop Header */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    <div className="lg:col-span-4">
                      <p className="text-caption text-muted-foreground mb-2">{drop.date}</p>
                      <h2 className="heading-section mb-4">{drop.name}</h2>
                      <p className="text-editorial text-muted-foreground mb-6">
                        {drop.tagline}
                      </p>
                      <p className="text-mono text-muted-foreground">
                        {dropProducts.length} {dropProducts.length === 1 ? 'PIECE' : 'PIECES'}
                      </p>
                    </div>
                    
                    {/* Drop Cover Image */}
                    <div className="lg:col-span-8">
                      <div className="aspect-[16/9] bg-muted overflow-hidden">
                        <img 
                          src={studioImage}
                          alt={drop.name}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Drop Products Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dropProducts.slice(0, 4).map(product => (
                      <Link 
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="group"
                      >
                        <div className="aspect-square bg-muted mb-3 overflow-hidden p-4">
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs group-hover:bg-muted/80 transition-colors">
                            IMG
                          </div>
                        </div>
                        <p className="text-mono text-xs group-hover:opacity-70 transition-opacity">
                          {product.name}
                        </p>
                      </Link>
                    ))}
                  </div>

                  {/* View Drop Link */}
                  <div className="mt-8">
                    <Link 
                      to={`/shop?drop=${drop.id}`}
                      className="btn-ghost"
                    >
                      VIEW {drop.name}
                    </Link>
                  </div>

                  {/* Divider */}
                  {index < drops.length - 1 && (
                    <div className="mt-24 border-b border-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Archive;
