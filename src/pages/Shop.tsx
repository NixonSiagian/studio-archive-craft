import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import ProductCard, { DbProduct } from '@/components/products/ProductCard';
import { supabase } from '@/integrations/supabase/client';

type FilterType = 'drop' | 'category' | 'color';

interface Filters {
  drop: string;
  category: string;
  color: string;
}

const Shop = () => {
  const [filters, setFilters] = useState<Filters>({
    drop: 'all',
    category: 'all',
    color: 'all',
  });

  // Fetch products from database
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: async () => {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch images for each product
      const productIds = productsData?.map((p) => p.id) || [];
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .in('product_id', productIds)
        .order('sort_order', { ascending: true });

      // Merge images with products
      return productsData?.map((product) => ({
        ...product,
        stock_by_size: product.stock_by_size as Record<string, number>,
        images: imagesData?.filter((img) => img.product_id === product.id) || [],
      })) as DbProduct[];
    },
  });

  // Get unique values for filters
  const drops = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.drop))];
  }, [products]);

  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const colors = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.color))];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      if (filters.drop !== 'all' && product.drop !== filters.drop) return false;
      if (filters.category !== 'all' && product.category !== filters.category) return false;
      if (filters.color !== 'all' && product.color !== filters.color) return false;
      return true;
    });
  }, [products, filters]);

  const updateFilter = (key: FilterType, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ drop: 'all', category: 'all', color: 'all' });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== 'all');

  // Format drop label for display
  const formatDropLabel = (drop: string) => drop.replace('-', ' ').toUpperCase();

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
              {drops.length > 0 && (
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
                    {drops.map((drop) => (
                      <button
                        key={drop}
                        onClick={() => updateFilter('drop', drop)}
                        className={`text-mono text-xs px-3 py-1.5 border transition-colors ${
                          filters.drop === drop
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-border hover:border-foreground'
                        }`}
                      >
                        {formatDropLabel(drop)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              {categories.length > 0 && (
                <div>
                  <p className="text-mono text-muted-foreground mb-3">CATEGORY</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateFilter('category', 'all')}
                      className={`text-mono text-xs px-3 py-1.5 border transition-colors uppercase ${
                        filters.category === 'all'
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      ALL
                    </button>
                    {categories.map((cat) => (
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
              )}

              {/* Color Filter */}
              {colors.length > 0 && (
                <div>
                  <p className="text-mono text-muted-foreground mb-3">COLOR</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateFilter('color', 'all')}
                      className={`text-mono text-xs px-3 py-1.5 border transition-colors uppercase ${
                        filters.color === 'all'
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      ALL
                    </button>
                    {colors.map((color) => (
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
              )}
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
              {isLoading ? 'LOADING...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'PIECE' : 'PIECES'}`}
            </p>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted mb-4" />
                  <div className="h-4 bg-muted w-3/4 mb-2" />
                  <div className="h-3 bg-muted w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
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
