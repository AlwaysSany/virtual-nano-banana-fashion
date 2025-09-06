
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { editImageWithGemini } from '../services/geminiService';
import { UploadArea } from './UploadArea';
import { Spinner } from './Spinner';

interface TryOnModalProps {
  product: Product;
  baseImage: { data: string; mimeType: string } | null;
  onClose: () => void;
  onStyleFurther: (imageData: {data: string; mimeType: string}) => void;
}

export const TryOnModal: React.FC<TryOnModalProps> = ({ product, baseImage, onClose, onStyleFurther }) => {
  const [userImage, setUserImage] = useState<{ file: File; preview: string; } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<{data: string; mimeType: string;} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdvancedMode = !!baseImage;

  const handleFileChange = (file: File | null) => {
    if (file) {
      setUserImage({ file, preview: URL.createObjectURL(file) });
      setGeneratedImage(null);
      setError(null);
    }
  };
  
  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    };
  };

  const handleGenerate = useCallback(async () => {
    let sourceImage: { data: string; mimeType: string } | null = null;
    
    if (isAdvancedMode && baseImage) {
      sourceImage = baseImage;
    } else if (userImage?.file) {
      sourceImage = await fileToGenerativePart(userImage.file);
    }

    if (!sourceImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await editImageWithGemini(sourceImage.data, sourceImage.mimeType, product.name);
      if (result) {
        setGeneratedImage(result);
      } else {
         setError("Sorry, the AI couldn't generate an image. Please try again.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [userImage, product.name, isAdvancedMode, baseImage]);

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.download = `tryon_${product.name.replace(/\s+/g, '_')}.png`;
    link.href = `data:${generatedImage.mimeType};base64,${generatedImage.data}`;
    link.click();
  };

  const handleStyleFurtherClick = () => {
    if (generatedImage) {
        onStyleFurther(generatedImage);
    }
  };

  const getButtonState = () => {
    if(isLoading) return { disabled: true, text: 'Generating...'};
    if (isAdvancedMode) return { disabled: false, text: `Add ${product.name}`};
    return { disabled: !userImage, text: 'Generate Try-On'};
  };

  const buttonState = getButtonState();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-800 p-8 relative transform transition-all duration-300 scale-95 animate-modal-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">Try On: {product.name}</h2>
        <p className="text-center text-gray-600 mb-6">{isAdvancedMode ? "Adding to your styled image." : "Upload your photo to see how it looks."}</p>

        {!isAdvancedMode && !generatedImage && (
            <UploadArea onFileChange={handleFileChange} preview={userImage?.preview} />
        )}
        
        {isAdvancedMode && !generatedImage && (
             <div className="my-4 text-center">
                <img src={`data:${baseImage?.mimeType};base64,${baseImage?.data}`} alt="Current look" className="max-w-full max-h-80 mx-auto rounded-xl shadow-lg" />
            </div>
        )}

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg my-4 text-center">{error}</div>}
        
        {isLoading && (
            <div className="text-center my-6">
                <Spinner />
                <p className="mt-4 text-gray-600 animate-pulse">Applying your new look... this can take a moment.</p>
            </div>
        )}

        {generatedImage && (
            <div className="my-4 text-center">
                <h3 className="font-bold text-lg mb-4">Here's Your New Look!</h3>
                <img src={`data:${generatedImage.mimeType};base64,${generatedImage.data}`} alt="Try-on result" className="max-w-full max-h-96 mx-auto rounded-xl shadow-2xl" />
            </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {!generatedImage ? (
                <button
                    onClick={handleGenerate}
                    disabled={buttonState.disabled}
                    className="w-full sm:w-auto flex-grow bg-[#859900] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#6b7f00] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
                >
                    {buttonState.text}
                </button>
            ) : (
                <>
                    <button onClick={handleDownload} className="w-full sm:w-auto bg-[#2aa198] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1f7f7a] transition transform hover:scale-105">
                        Download
                    </button>
                    <button onClick={handleStyleFurtherClick} className="w-full sm:w-auto bg-[#859900] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#6b7f00] transition transform hover:scale-105">
                        Style Further
                    </button>
                    <button onClick={onClose} className="w-full sm:w-auto bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition transform hover:scale-105">
                        Close
                    </button>
                </>
            )}
        </div>
      </div>
       <style>{`
          @keyframes modal-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-modal-in { animation: modal-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
