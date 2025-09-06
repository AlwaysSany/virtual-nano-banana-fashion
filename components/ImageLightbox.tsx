import React, { useEffect, useCallback } from 'react';
import { Product } from '../types';

interface ImageLightboxProps {
  product: Product | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ product, onClose }) => {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-gray-50 flex items-center justify-center">
            <img src={product.imageSrc} alt={product.name} className="max-h-[80vh] w-full object-contain" />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-[#859900] text-xl font-semibold mb-4">{product.price}</p>
            <div className="text-gray-600 text-sm mb-6">
              <p>Category: <span className="font-semibold">{product.category}</span></p>
              <p className="mt-2">Click outside or press Esc to close.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
