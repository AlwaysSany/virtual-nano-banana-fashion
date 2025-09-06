
import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onTryNow: (product: Product) => void;
  onPreview?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onTryNow, onPreview }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onTryNow={onTryNow} onPreview={onPreview} />
      ))}
    </div>
  );
};
