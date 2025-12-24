import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { formatPrice } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { getProductImage, DbProduct } from '@/components/products/ProductCard';
import SizeGuide from '@/components/products/SizeGuide';
import { supabase } from '@/integrations/supabase/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product from database by slug
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', id)
        .eq('is_active', true)
        .maybeSingle();

      if (productError) throw productError;
      if (!productData) return null;

      // Fetch images
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productData.id)
        .order('sort_order', { ascending: true });

      return {
        ...productData,
        stock_by_size: productData.stock_by_size as Record<string, number>,
        images: imagesData || [],
      } as DbProduct;
    },
  });

  // Get all product images
  const productImages = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images.map((img) => img.image_url);
    }
    return [getProductImage(product)];
  }, [product]);

  // Get stock for size
  const getStock = (size: string): number => {
    if (!product?.stock_by_size) return 0;
    return product.stock_by_size[size] || 0;
  };

  // Format drop label
  const dropLabel = product?.drop.replace('-', ' ').toUpperCase() || '';

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;

    // Convert to cart-compatible format
    const cartProduct = {
      id: product.slug,
      name: product.name,
      price: product.price_idr,
      currency: 'IDR',
      drop: product.drop,
      dropLabel: dropLabel,
      category: product.category,
      color: product.color,
      availability: 'limited',
      availabilityLabel: product.availability_label,
      description: product.description_lines,
      images: productImages,
      sizes: product.sizes,
      inStock: true,
    };

    addToCart(cartProduct, selectedSize, quantity);
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="py-section">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="aspect-[4/5] bg-muted animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 bg-muted w-24" />
                <div className="h-8 bg-muted w-48" />
                <div className="h-6 bg-muted w-32" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!product || error) {
    return (
      <Layout>
        <div className="py-section container mx-auto px-6 lg:px-12 text-center">
          <h1 className="heading-section mb-6">Product Not Found</h1>
          <Link to="/shop" className="btn-outline">
            RETURN TO SHOP
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <title>{product.name} — WNM</title>
      <meta
        name="description"
        content={`${product.name} from ${dropLabel}. ${product.description_lines.join(' ')}`}
      />

      <section className="py-section">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-caption mb-8 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={14} />
            BACK
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-[4/5] bg-muted overflow-hidden p-8 md:p-12">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 bg-muted p-2 border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-foreground'
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-8">
              {/* Header */}
              <div>
                <p className="text-caption text-muted-foreground mb-2">{dropLabel}</p>
                <h1 className="heading-section mb-4">{product.name}</h1>
                <p className="font-display text-2xl">{formatPrice(product.price_idr)}</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                {product.description_lines.map((line, index) => (
                  <p key={index} className="text-editorial text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>

              {/* Availability Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border">
                <span className="w-2 h-2 rounded-full bg-foreground" />
                <span className="text-mono text-xs">{product.availability_label}</span>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-mono text-muted-foreground">SIZE</p>
                  <SizeGuide />
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const stock = getStock(size);
                    const isOutOfStock = stock === 0;

                    return (
                      <button
                        key={size}
                        onClick={() => !isOutOfStock && setSelectedSize(size)}
                        disabled={isOutOfStock}
                        className={`w-12 h-12 border text-sm transition-colors relative ${
                          isOutOfStock
                            ? 'border-border text-muted-foreground/50 cursor-not-allowed'
                            : selectedSize === size
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-border hover:border-foreground'
                        }`}
                      >
                        {size}
                        {isOutOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-px bg-muted-foreground/30 rotate-45 absolute" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-mono text-muted-foreground mb-3">QUANTITY</p>
                <div className="inline-flex items-center border border-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`btn-primary w-full ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {selectedSize ? 'ADD TO CART' : 'SELECT SIZE'}
              </button>

              {/* Shipping Note */}
              <p className="text-xs text-muted-foreground text-center">Ships in 1–3 days</p>

              {/* Accordions */}
              <Accordion type="single" collapsible className="border-t border-border">
                <AccordionItem value="shipping" className="border-b border-border">
                  <AccordionTrigger className="text-mono text-xs py-4 hover:no-underline">
                    SHIPPING
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <p className="text-sm text-muted-foreground">
                      Standard shipping within Indonesia: 3–5 business days.
                      <br />
                      International shipping: 7–14 business days.
                      <br />
                      All orders are processed within 1–3 business days.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns" className="border-b border-border">
                  <AccordionTrigger className="text-mono text-xs py-4 hover:no-underline">
                    RETURNS
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <p className="text-sm text-muted-foreground">
                      We accept returns within 14 days of delivery for unworn items in original
                      packaging.
                      <br />
                      Contact studio@wnm.co to initiate a return.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
