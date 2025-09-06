
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        className="w-full bg-white/10 placeholder-[#93a1a1] text-[#eee8d5] rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#859900] transition duration-300"
        placeholder="Search for clothes, shoes, accessories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#93a1a1]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};
