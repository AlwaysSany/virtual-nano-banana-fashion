
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-[#eee8d5]">
        Virtual Fashion Try-On
      </h1>
      <p className="text-lg text-[#93a1a1]">
        Try on any fashion item with AI-powered virtual fitting
      </p>
    </header>
  );
};
