import { Link } from 'react-router-dom';
import { formatPrice } from '@/data/products';
import productBrent from '@/assets/product-brent.jpg';
import productDrake from '@/assets/product-drake.jpg';
import productTyler from '@/assets/product-tyler.jpg';
import productAntman from '@/assets/product-antman.jpg';

// Database product interface
export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  price_idr: number;
  drop: string;
  category: string;
  color: string;
  availability_label: string;
  description_lines: string[];
  sizes: string[];
  stock_by_size: Record<string, number>;
  is_active: boolean;
  images?: { id: string; image_url: string; sort_order: number }[];
}

interface ProductCardProps {
  product: DbProduct;
}

// Fallback images for legacy products
const productImageMap: Record<string, string> = {
  'ant-man': productAntman,
  'drake': productDrake,
  'brent': productBrent,
  'if-youre-reading-this': productTyler
};

export const getProductImage = (product: DbProduct): string | null => {
  // First check for database images
  if (product.images && product.images.length > 0) {
    const sortedImages = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
    return sortedImages[0].image_url;
  }
  // Then check for local fallback by slug
  if (productImageMap[product.slug]) {
    return productImageMap[product.slug];
  }
  // Return null for no image
  return null;
};

// Image placeholder component
export const ImagePlaceholder = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center bg-muted ${className}`}>
    <span className="text-[10px] text-muted-foreground tracking-widest uppercase">IMAGE PENDING</span>
  </div>
);

const ProductCard = ({ product }: ProductCardProps) => {
  const image = getProductImage(product);

  // Format drop label (e.g., "archive-001" -> "ARCHIVE 001")
  const dropLabel = product.drop.replace('-', ' ').toUpperCase();

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group block"
    >
      {/* Product Image */}
      <div className="aspect-square bg-muted mb-4 overflow-hidden relative p-6">
        {image ? (
          <img 
            src={image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
            onError={(e) => {
              // Hide broken image and show placeholder
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const placeholder = document.createElement('div');
                placeholder.className = 'w-full h-full flex items-center justify-center';
                placeholder.innerHTML = '<span class="text-[10px] text-muted-foreground tracking-widest uppercase">IMAGE PENDING</span>';
                parent.appendChild(placeholder);
              }
            }}
          />
        ) : (
          <ImagePlaceholder className="w-full h-full" />
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-4 left-4">
          <span className="text-mono text-[10px] text-muted-foreground bg-background/80 px-2 py-1">
            {product.availability_label}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="heading-product text-sm group-hover:opacity-70 transition-opacity duration-300">
            {product.name}
          </h3>
          <span className="text-sm text-muted-foreground flex-shrink-0">
            {formatPrice(product.price_idr)}
          </span>
        </div>
        
        <p className="text-mono text-[10px] text-muted-foreground">
          {dropLabel}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
