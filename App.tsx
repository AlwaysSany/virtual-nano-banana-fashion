
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { TryOnModal } from './components/TryOnModal';
import { AddProductModal } from './components/AddProductModal';
import { Product, Category } from './types';
import { getUserProducts, setUserProducts as persistUserProducts } from './services/storage';
import { PRODUCTS, CATEGORIES } from './constants';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  // Load user products using IndexedDB helper (with fallbacks inside)
  useEffect(() => {
    (async () => {
      const loaded = await getUserProducts();
      if (loaded && Array.isArray(loaded)) {
        setUserProducts(loaded);
      }
    })();
  }, []);

  // Persist user products on change
  useEffect(() => {
    (async () => {
      const where = await persistUserProducts(userProducts);
      if (where === 'idb' || where === 'local') {
        setStorageWarning(null);
      } else if (where === 'session') {
        setStorageWarning('Saved to session only. Your added products will be kept for this tab but may not persist across browser restarts.');
      } else {
        setStorageWarning('Could not persist added products. Try generating smaller images or clearing storage.');
      }
    })();
  }, [userProducts]);

  const allProducts = useMemo(() => {
    return [...PRODUCTS, ...userProducts];
  }, [userProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory, allProducts]);

  const handleTryNow = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  
  // Style Further feature removed; no staged image pipeline

  const handleCreateProduct = (partial: Omit<Product, 'id'>) => {
    // Compute next sequential id across both lists
    const maxId = allProducts.reduce((m, p) => Math.max(m, p.id), 0);
    const next: Product = { id: maxId + 1, ...partial } as Product;
    // Update state optimistically
    setUserProducts((prev) => [...prev, next]);
    // Also persist immediately to surface any warnings
    (async () => {
      const where = await persistUserProducts([...userProducts, next]);
      if (where === 'idb' || where === 'local') {
        setStorageWarning(null);
      } else if (where === 'session') {
        setStorageWarning('Saved to session only. Your added products will be kept for this tab but may not persist across browser restarts.');
      } else {
        alert('Failed to persist product. The image may be too large for storage. Try a simpler prompt or smaller image.');
      }
    })();
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#002b36] to-[#073642] min-h-screen text-[#eee8d5] font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />
        <main>
          {storageWarning && (
            <div className="mb-4 bg-yellow-100 text-yellow-800 p-3 rounded-lg">{storageWarning}</div>
          )}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl">
             <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
             <CategoryFilter 
                categories={CATEGORIES} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
            />
          </div>

          {/* Style Further preview removed */}
          
          <div className="flex items-center justify-between mb-4">
            <div />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#268bd2] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#1a6ea6] transition-colors duration-300"
            >
              Add Product
            </button>
          </div>
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

      {isAddModalOpen && (
        <AddProductModal
          onClose={() => setIsAddModalOpen(false)}
          onCreate={(data) => handleCreateProduct(data)}
        />
      )}
    </div>
  );
}
