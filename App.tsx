
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { TryOnModal } from './components/TryOnModal';
import { Product, Category } from './types';
import { PRODUCTS, CATEGORIES } from './constants';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const handleTryNow = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  
  // Style Further feature removed; no staged image pipeline

  return (
    <div className="bg-gradient-to-br from-[#002b36] to-[#073642] min-h-screen text-[#eee8d5] font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />
        <main>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl">
             <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
             <CategoryFilter 
                categories={CATEGORIES} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
            />
          </div>

          {/* Style Further preview removed */}
          
          <ProductGrid products={filteredProducts} onTryNow={handleTryNow} />
        </main>
      </div>

      {isModalOpen && selectedProduct && (
        <TryOnModal
          product={selectedProduct}
          baseImage={null}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
