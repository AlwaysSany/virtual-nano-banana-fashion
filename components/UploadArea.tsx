
import React, { useState, useCallback } from 'react';

interface UploadAreaProps {
  onFileChange: (file: File | null) => void;
  preview: string | null;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileChange, preview }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  }, [onFileChange]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };

  return (
    <div className="my-4">
      {preview ? (
        <div className="text-center">
            <img src={preview} alt="Preview" className="max-w-full max-h-80 mx-auto rounded-xl shadow-lg" />
            <button onClick={() => onFileChange(null)} className="mt-4 bg-[#2aa198] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#1f7f7a] transition">
                Change Photo
            </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragOver ? 'border-[#859900] bg-[#fdf6e3]' : 'border-white/30 bg-white/5 hover:border-[#859900]/80'}`}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <div className={`mx-auto h-16 w-16 text-[#93a1a1] transition-colors ${isDragOver ? 'text-[#859900]' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="mt-2 font-semibold text-[#859900]">Click to upload or drag and drop</p>
          <p className="text-sm text-[#93a1a1]">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
};
