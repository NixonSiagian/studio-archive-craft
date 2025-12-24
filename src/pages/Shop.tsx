import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { products, drops } from '@/data/products';

type FilterType = 'drop' | 'category' | 'color' | 'availability';

interface Filters {
  drop: string;
  category: string;
  color: string;
  availability: string;
}

const Shop = () => {
  const [filters, setFilters] = useState<Filters>({
    drop: 'all',
    category: 'all',
    color: 'all',
    availability: 'all'
  });

  const categories = ['all', 'tee', 'hoodie'];
  const colors = ['all', ...new Set(products.map(p => p.color))];
  const availabilities = ['all', 'limited'];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.drop !== 'all' && product.drop !== filters.drop) return false;
      if (filters.category !== 'all' && product.category !== filters.category) return false;
      if (filters.color !== 'all' && product.color !== filters.color) return false;
      if (filters.availability !== 'all' && product.availability !== filters.availability) return false;
      return true;
    });
  }, [filters]);

  const updateFilter = (key: FilterType, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ drop: 'all', category: 'all', color: 'all', availability: 'all' });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== 'all');

  return (
    <Layout>
      <title>Shop — WNM</title>
      <meta name="description" content="Browse the WNM collection. Limited-run garments produced once and never restocked." />

      <section className="py-section">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-12">
            <p className="text-caption mb-3">COLLECTION</p>
            <h1 className="heading-section">SHOP ALL</h1>
          </div>

          {/* Filters */}
          <div className="mb-12 pb-8 border-b border-border">
            <div className="flex flex-wrap gap-8">
              {/* Drop Filter */}
              <div>
                <p className="text-mono text-muted-foreground mb-3">DROP</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateFilter('drop', 'all')}
                    className={`text-mono text-xs px-3 py-1.5 border transition-colors ${
                      filters.drop === 'all' 
                        ? 'bg-foreground text-background border-foreground' 
                        : 'border-border hover:border-foreground'
                    }`}
                  >
                    ALL
                  </button>
                  {drops.map(drop => (
                    <button
                      key={drop.id}
                      onClick={() => updateFilter('drop', drop.id)}
                      className={`text-mono text-xs px-3 py-1.5 border transition-colors ${
                        filters.drop === drop.id 
                          ? 'bg-foreground text-background border-foreground' 
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {drop.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <p className="text-mono text-muted-foreground mb-3">CATEGORY</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat)}
                      className={`text-mono text-xs px-3 py-1.5 border transition-colors uppercase ${
                        filters.category === cat 
                          ? 'bg-foreground text-background border-foreground' 
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <p className="text-mono text-muted-foreground mb-3">COLOR</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => updateFilter('color', color)}
                      className={`text-mono text-xs px-3 py-1.5 border transition-colors uppercase ${
                        filters.color === color 
                          ? 'bg-foreground text-background border-foreground' 
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-6 text-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                CLEAR FILTERS
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-mono text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'PIECE' : 'PIECES'}
            </p>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-muted-foreground mb-4">No pieces match your filters.</p>
              <button onClick={clearFilters} className="btn-ghost">
                VIEW ALL PIECES
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
