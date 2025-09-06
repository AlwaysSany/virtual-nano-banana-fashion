
import React, { useMemo, useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onTryNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onTryNow }) => {
  const [imgError, setImgError] = useState(false);
  const initials = useMemo(() => {
    return product.name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('');
  }, [product.name]);
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="h-40 sm:h-48 bg-white/20 flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img
            src={product.imageSrc}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12 text-[#93a1a1] mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0L21.75 21M4.5 19.5h15a1.5 1.5 0 001.5-1.5v-12A1.5 1.5 0 0019.5 4.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z" />
            </svg>
            <span className="text-[#93a1a1] font-semibold">{initials}</span>
          </div>
        )}
      </div>
      <div className="p-4 text-[#eee8d5]">
        <h3 className="font-bold text-base sm:text-lg truncate">{product.name}</h3>
        <p className="text-[#859900] text-sm sm:text-base font-semibold mb-3">{product.price}</p>
        <button
          onClick={() => onTryNow(product)}
          className="w-full bg-[#859900] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#6b7f00] transition-colors duration-300 transform hover:scale-105"
        >
          Try Now
        </button>
      </div>
    </div>
  );
};
