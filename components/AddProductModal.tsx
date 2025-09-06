import React, { useMemo, useState } from 'react';
import { Category, Product } from '../types';
import { CATEGORIES } from '../constants';
import { generateImageFromPrompt, editImageWithGeminiComposite } from '../services/geminiService';
import { UploadArea } from './UploadArea';

interface AddProductModalProps {
  onClose: () => void;
  onCreate: (product: Omit<Product, 'id'>) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onCreate }) => {
  const [prompt, setPrompt] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('shirts');
  const [price, setPrice] = useState('$0.00');
  const [preview, setPreview] = useState<{ data: string; mimeType: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // High-fidelity logo controls
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoColor, setLogoColor] = useState('');
  const [logoStyle, setLogoStyle] = useState('printed'); // printed | embroidered | embossed etc.
  const [logoSize, setLogoSize] = useState('medium'); // small | medium | large
  const [isApplyingLogo, setIsApplyingLogo] = useState(false);

  const canSave = useMemo(() => {
    return !!preview && name.trim().length > 0 && price.trim().length > 0;
  }, [preview, name, price]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const result = await generateImageFromPrompt(prompt);
      if (!result) {
        setError("Couldn't generate an image. Please try again.");
      } else {
        // Compress to reduce localStorage usage
        const compressed = await compressGenerativeImage(result, 1024, 0.85);
        setPreview(compressed);
        // Default name suggestion from prompt
        if (!name.trim()) setName(prompt.slice(0, 40));
      }
    } catch (e: any) {
      setError(e.message || 'Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogoFile = (file: File | null) => {
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const dataUrlToPart = (dataUrl: string): { data: string; mimeType: string } | null => {
    const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
    if (!m) return null;
    return { data: m[2], mimeType: m[1] };
  };

  const fileToPart = async (file: File): Promise<{ data: string; mimeType: string }> => {
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return { data: base64, mimeType: file.type || 'image/png' };
  };

  const handleApplyLogo = async () => {
    if (!preview || !logoFile) {
      setError('Please generate a base image and select a logo to upload.');
      return;
    }
    setError(null);
    setIsApplyingLogo(true);
    try {
      const base = preview; // current generated product image
      const logoPart = await fileToPart(logoFile);
      const describeIntegration = `${logoStyle} look${logoColor ? ` in ${logoColor}` : ''}, ${logoSize} size`;
      const instruction = `The first image is a logo reference. The last image is the product to edit. Place the logo onto the product in a high-fidelity manner. Ensure the product's existing features and details remain completely unchanged. The logo should look like it's naturally ${logoStyle} on the material${logoColor ? `, using a ${logoColor} color variant` : ''}, at a ${logoSize} size, following the folds, texture, and lighting of the fabric. Do not paste it as a sticker; recreate it with correct perspective, subtle shadows, and blending. Output only the edited product image.`;

      // Per our composite function, references first then base
      const result = await editImageWithGeminiComposite({
        base,
        references: [logoPart],
        instruction,
        defaultProductName: name || prompt || 'product',
      });
      if (!result) {
        setError("Couldn't apply the logo. Please try another logo or settings.");
        return;
      }
      const compressed = await compressGenerativeImage(result, 1024, 0.85);
      setPreview(compressed);
    } catch (e: any) {
      setError(e.message || 'Failed to apply the logo.');
    } finally {
      setIsApplyingLogo(false);
    }
  };

  const handleSave = () => {
    if (!preview) return;
    const dataUrl = `data:${preview.mimeType};base64,${preview.data}`;
    const product: Omit<Product, 'id'> = {
      name: name.trim(),
      category,
      price: price.trim(),
      imageSrc: dataUrl,
    };
    try {
      onCreate(product);
    } catch (e) {
      setError('Failed to save product. The image might be too large for storage. Try a simpler prompt or smaller image.');
    }
  };


  async function compressGenerativeImage(
    img: { data: string; mimeType: string },
    maxDim: number,
    quality: number
  ): Promise<{ data: string; mimeType: string }> {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(img.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: img.mimeType || 'image/png' });
      const bitmap = await createImageBitmap(blob);
      const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
      const targetW = Math.max(1, Math.round(bitmap.width * scale));
      const targetH = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return img;
      ctx.drawImage(bitmap, 0, 0, targetW, targetH);
      const outMime = 'image/jpeg';
      const outDataUrl = canvas.toDataURL(outMime, quality);
      const m = outDataUrl.match(/^data:([^;]+);base64,(.*)$/);
      if (m) {
        return { data: m[2], mimeType: m[1] };
      }
      return img;
    } catch {
      return img; // fallback to original
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gradient-to-b from-white to-white/90 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-800 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-2">Add Product (AI Generate)</h2>
        <p className="text-gray-600 mb-4">Enter a prompt to generate a product image. Optionally apply a logo with high-fidelity detail preservation, then fill in details and save.</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

        <label className="block text-sm font-semibold text-gray-700 mb-2">Prompt</label>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 text-sm mb-3"
          placeholder="e.g., A professionally shot photo of orange high-top sneakers on a plain white background"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-[#859900] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#6b7f00] disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {preview && (
          <div className="mt-5">
            <h3 className="font-semibold mb-2">Preview</h3>
            <img
              src={`data:${preview.mimeType};base64,${preview.data}`}
              alt="Generated product"
              className="max-w-full rounded-lg shadow"
            />
            <div className="mt-4 p-4 bg-white/70 rounded-xl border border-gray-100">
              <h4 className="font-semibold mb-2">Optional: Add Logo (High-fidelity)</h4>
              <p className="text-xs text-gray-600 mb-3">Upload a logo, choose how it should appear, and we’ll blend it realistically with folds, texture, and lighting.</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <div>
                  <UploadArea onFileChange={handleLogoFile} preview={logoPreview} />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <select className="border rounded p-2 text-sm flex-1" value={logoStyle} onChange={(e) => setLogoStyle(e.target.value)}>
                      <option value="printed">Printed</option>
                      <option value="embroidered">Embroidered</option>
                      <option value="embossed">Embossed</option>
                    </select>
                    <select className="border rounded p-2 text-sm flex-1" value={logoSize} onChange={(e) => setLogoSize(e.target.value)}>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <input
                    className="border rounded p-2 text-sm"
                    placeholder="Logo color (optional)"
                    value={logoColor}
                    onChange={(e) => setLogoColor(e.target.value)}
                  />
                  <button
                    onClick={handleApplyLogo}
                    disabled={!logoFile || isApplyingLogo}
                    className="bg-[#268bd2] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#1a6ea6] disabled:opacity-50 self-start"
                  >
                    {isApplyingLogo ? 'Applying...' : 'Apply Logo'}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">We preserve product details and blend the logo realistically with folds, texture, and lighting.</p>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
            <input
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="$99.99"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} disabled={!canSave} className="bg-[#268bd2] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#1a6ea6] disabled:opacity-50">Save Product</button>
        </div>
      </div>
    </div>
  );
}
