import { Link } from 'react-router-dom';
import { Product, formatPrice } from '@/data/products';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';

interface ProductCardProps {
  product: Product;
}

const productImageMap: Record<string, string> = {
  'ant-man-tee': product1,
  'if-youre-reading-this-tee': product2,
  'brent-tee': product3,
  'wnm-studio-tee': product4
};

const ProductCard = ({ product }: ProductCardProps) => {
  const image = productImageMap[product.id] || product1;

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group block"
    >
      {/* Product Image */}
      <div className="aspect-[3/4] bg-muted mb-4 overflow-hidden relative">
        <img 
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
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
