'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  discount_price: number;
  rating: number;
  image: string | null;
  badge: string;
}

interface HomeProductListProps {
  products: Product[];
}

export const HomeProductList: React.FC<HomeProductListProps> = ({ products }) => {
  const { addToCart, syncing } = useCart();

  const handleAdd = async (productId: string, name: string) => {
    try {
      await addToCart(productId, null, 1);
      alert(`Success: Added ${name} to your Cart!`);
    } catch (err) {
      console.error(err);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {products.map((product) => (
        <Card key={product.id} className="group relative flex flex-col h-full overflow-hidden hover:border-primary transition-all p-0">
          {/* Product Badge */}
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="sale">{product.badge}</Badge>
          </div>

          {/* Wishlist Icon */}
          <button className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow hover:text-sale-red text-warm-gray transition-colors">
            <Heart size={18} />
          </button>

          {/* Image Container */}
          <div className="h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-warm-gray font-bold text-sm bg-[#faf8f5]">
                No Image Available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-body-sm text-warm-gray">{product.category}</span>
              <Link href={`/product/${product.slug}`} className="block hover:text-primary transition-colors">
                <h3 className="text-title-md font-bold text-on-surface line-clamp-2 min-h-[48px]">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 text-yellow-500">
                <span>★</span>
                <span className="text-body-sm font-semibold text-on-surface">{product.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                {product.price > product.discount_price && (
                  <span className="text-body-sm line-through text-warm-gray mr-2">₹{product.price}</span>
                )}
                <span className="text-price-display text-price-green">₹{product.discount_price}</span>
              </div>
              
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleAdd(product.id, product.name)}
                disabled={syncing}
              >
                ADD +
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
export default HomeProductList;
