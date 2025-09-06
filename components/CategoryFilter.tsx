
import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: { id: Category; name: string }[];
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[#859900] ${
            activeCategory === category.id
              ? 'bg-[#fdf6e3] text-[#859900] shadow-lg scale-105'
              : 'bg-white/10 text-[#eee8d5] hover:bg-white/20'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
