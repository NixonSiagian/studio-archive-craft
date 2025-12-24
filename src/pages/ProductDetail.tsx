import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { products, formatPrice } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { getProductImage } from '@/components/products/ProductCard';
import SizeGuide from '@/components/products/SizeGuide';
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
  
  const product = products.find(p => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
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

  const productImage = getProductImage(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
  };

  return (
    <Layout>
      <title>{product.name} — WNM</title>
      <meta name="description" content={`${product.name} from ${product.dropLabel}. ${product.description.join(' ')}`} />

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
              <div className="aspect-[3/4] bg-muted overflow-hidden">
                <img 
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-8">
              {/* Header */}
              <div>
                <p className="text-caption text-muted-foreground mb-2">
                  {product.dropLabel}
                </p>
                <h1 className="heading-section mb-4">{product.name}</h1>
                <p className="font-display text-2xl">{formatPrice(product.price)}</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                {product.description.map((line, index) => (
                  <p key={index} className="text-editorial text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>

              {/* Availability Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border">
                <span className="w-2 h-2 rounded-full bg-foreground" />
                <span className="text-mono text-xs">{product.availabilityLabel}</span>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-mono text-muted-foreground">SIZE</p>
                  <SizeGuide />
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border text-sm transition-colors ${
                        selectedSize === size
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-mono text-muted-foreground mb-3">QUANTITY</p>
                <div className="inline-flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
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
                className={`btn-primary w-full ${
                  !selectedSize ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {selectedSize ? 'ADD TO CART' : 'SELECT SIZE'}
              </button>

              {/* Shipping Note */}
              <p className="text-xs text-muted-foreground text-center">
                Ships in 1–3 days
              </p>

              {/* Accordions */}
              <Accordion type="single" collapsible className="border-t border-border">
                <AccordionItem value="shipping" className="border-b border-border">
                  <AccordionTrigger className="text-mono text-xs py-4 hover:no-underline">
                    SHIPPING
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <p className="text-sm text-muted-foreground">
                      Standard shipping within Indonesia: 3–5 business days.<br />
                      International shipping: 7–14 business days.<br />
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
                      We accept returns within 14 days of delivery for unworn items in original packaging.<br />
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
