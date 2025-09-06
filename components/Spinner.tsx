
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-12 h-12 border-4 border-[#93a1a1] border-t-[#859900] rounded-full animate-spin"></div>
    </div>
  );
};
