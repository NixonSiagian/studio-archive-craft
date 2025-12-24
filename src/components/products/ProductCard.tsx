import { Link } from 'react-router-dom';
import { Product, formatPrice } from '@/data/products';
import productBrent from '@/assets/product-brent.jpg';
import productDrake from '@/assets/product-drake.jpg';
import productTyler from '@/assets/product-tyler.jpg';
import productAntman from '@/assets/product-antman.jpg';

interface ProductCardProps {
  product: Product;
}

const productImageMap: Record<string, string> = {
  'ant-man-tee': productAntman,
  'drake-tee': productDrake,
  'brent-tee': productBrent,
  'tyler-tee': productTyler
};

export const getProductImage = (productId: string) => {
  return productImageMap[productId] || productAntman;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const image = productImageMap[product.id] || productAntman;

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group block"
    >
      {/* Product Image */}
      <div className="aspect-square bg-muted mb-4 overflow-hidden relative p-6">
        <img 
          src={image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
        
        {/* Availability Badge */}
        <div className="absolute top-4 left-4">
          <span className="text-mono text-[10px] text-muted-foreground bg-background/80 px-2 py-1">
            {product.availabilityLabel}
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
            {formatPrice(product.price)}
          </span>
        </div>
        
        <p className="text-mono text-[10px] text-muted-foreground">
          {product.dropLabel}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
