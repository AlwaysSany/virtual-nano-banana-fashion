# Virtual Fashion Try‑On

An AI‑powered web app that lets users virtually try on fashion items (shirts, pants/jeans, shoes, hats, eyewear) using their own photo. Users can continue styling a generated image with additional items using the Advanced Styling mode and their speech.

**HomPage,**

<img width="1884" height="858" alt="Image" src="https://github.com/user-attachments/assets/5f141649-7a9f-4904-953f-74889063915f" />
<br/>

**Other Pages,**

| Preview 1 | Preview 2 | Preview 3 |
|-----------|-----------|-----------|
| <img src="https://github.com/user-attachments/assets/5f141649-7a9f-4904-953f-74889063915f" width="250"/> | <img src="https://github.com/user-attachments/assets/9956e61f-2245-4990-ae2b-68b82c84f9a2" width="250"/> | <img src="https://github.com/user-attachments/assets/606dfeef-7a5f-42e3-ba12-b2c39dac991d" width="250"/> |
| <img src="https://github.com/user-attachments/assets/4fad3d07-761e-4603-a03d-074b49eff034" width="250"/> | <img src="https://github.com/user-attachments/assets/3e104f54-3647-4b67-b555-ed5292d79b67" width="250"/> | <img src="https://github.com/user-attachments/assets/4f936954-c91c-45de-b7dd-c1af048315ef" width="250"/> |
| <img src="https://github.com/user-attachments/assets/01ed39fe-0e1f-4163-ba45-d8ba20d3bad4" width="250"/> | <img src="https://github.com/user-attachments/assets/471f5200-6127-4d66-bf38-1ec843df83c4" width="250"/> | <img src="https://github.com/user-attachments/assets/1237fd86-7560-4c31-a861-c570fe57e32e" width="250"/> |

**Full Working Demo:** https://youtu.be/q0iNOMOYygA

## Features
- Searchable, filterable product catalog (outerwear, hats, eyewear, shoes, shirts, pants)
- Try Now modal to upload a photo and generate a realistic try‑on
- Advanced Styling mode to add more products on top of the latest generated result
- Text-to-Product generation (Google Gemini “Nano Banana” flow): generate new product images from a prompt
- Text + Product Image to User Image: realistically place referenced product(s) on the person image
- Virtual Try‑On with multiple product references (composite): support for composing one or more product reference images
- ElevenLabs Speech‑to‑Text input in prompts: mic button in Add Product and Try‑On dialogs
- Solarized‑dark theme, responsive UI, accessible focus states
- Assets‑driven catalog (images in `assets/`)

## Architecture
- Frontend: React + Vite
- Styling: Tailwind via CDN (see `index.html`)
- Image generation/editing: Google Gemini 2.5 Flash (image preview) via `@google/genai`
- Speech‑to‑Text: ElevenLabs STT via REST API
- Data: `constants.ts` contains categories and products referencing `assets/`

## Project Structure
```
virtual-nano-banana-fashion/
├─ assets/                           # Product images (catalog sources)
├─ components/                       # React components
│  ├─ AddProductModal.tsx            # Text-to-product flow (prompt -> image) + logo application
│  ├─ AdvancedStylePreview.tsx
│  ├─ CategoryFilter.tsx
│  ├─ Header.tsx
│  ├─ MicButton.tsx                  # Reusable mic control (MediaRecorder + STT)
│  ├─ ProductCard.tsx
│  ├─ ProductGrid.tsx
│  ├─ SearchBar.tsx
│  ├─ Spinner.tsx
│  └─ TryOnModal.tsx                 # Try-on + "Put me on" instruction input
├─ services/
│  ├─ elevenlabsSTT.ts               # ElevenLabs Speech-to-Text service
│  └─ geminiService.ts               # Gemini 2.5 Flash image gen/edit (text, image+text, composite)
├─ App.tsx                           # App shell, filters, modal state, advanced styling routing
├─ constants.ts                      # Categories + product catalog (images only)
├─ types.ts                          # TS types (Product, Category)
├─ index.html                        # Vite entry + Tailwind CDN
├─ index.tsx                         # React mount
├─ env.local                         # Local environment (keys for Vite)
├─ vite-env.d.ts                     # Vite env typings (e.g., VITE_ELEVENLABS_API_KEY)
└─ README.md                         # This file
```

## Setup
### Prerequisites
- Node.js 18+

### 1) Install
```bash
npm install
```

### 2) Environment
Create or update `env.local` (or `.env.local`) at the project root with the following variables:
```bash
# Google Gemini (image generation + editing)
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# ElevenLabs Speech-to-Text (used client-side by the mic button)
VITE_ELEVENLABS_API_KEY=YOUR_ELEVENLABS_API_KEY
```
Restart the dev server after changing env values.

### 3) Run
```bash
npm run dev
```
Open http://localhost:5173

## How It Works
- Browse products and click “Try Now”.
- Upload a photo and click “Generate Try‑On”.
- When the result appears, click “Style Further” to stage the generated image.
- Choose another product and click “Try Now” again; the modal switches to Advanced Styling and applies the new item to the staged image.
- To create a brand‑new product from text, use Add Product, enter a prompt (or use the mic), and click Generate Image.
- Use the mic buttons (powered by ElevenLabs STT) in Add Product and in the Try‑On “Put me on” area to dictate prompts.

If Advanced Styling doesn’t start, ensure you clicked “Style Further” after a successful generation.

## Data Model
- `Product` (see `types.ts`)
  - `id: number`
  - `name: string`
  - `category: 'outerwear' | 'hats' | 'eyewear' | 'shoes' | 'shirts' | 'pants' | 'all'`
  - `price: string`
  - `imageSrc: string` (path inside `assets/`)
- `CATEGORIES` (see `constants.ts`)
  - `{ id: Category, name: string }[]`

## Gemini Integration
- File: `services/geminiService.ts`
- Model: `gemini-2.5-flash-image-preview`
- Reads key from `import.meta.env.VITE_GEMINI_API_KEY`
- Returns `{ data, mimeType }` (base64 image)
- Flows supported:
  - Text → Product Image: `generateImageFromPrompt(prompt)`
  - Image + Text → Edited Image: `editImageWithGemini(base64, mimeType, productName)`
  - Multi‑image Composite (references + base + instruction): `editImageWithGeminiComposite({ base, references, instruction })`

## ElevenLabs STT Integration
- File: `services/elevenlabsSTT.ts`
- Uses REST endpoint `POST https://api.elevenlabs.io/v1/speech-to-text` with `model_id=scribe_v1`
- Reads key from `import.meta.env.VITE_ELEVENLABS_API_KEY`
- UI usage:
  - Add Product: `components/AddProductModal.tsx` (mic below Prompt)
  - Try‑On: `components/TryOnModal.tsx` (mic in "Put me on" collapsible)
  - Shared control: `components/MicButton.tsx` (MediaRecorder + upload + transcript)

## Troubleshooting
- __Missing key__
  - Ensure `env.local` has `VITE_GEMINI_API_KEY` and `VITE_ELEVENLABS_API_KEY`
  - Restart the dev server after editing env values
- __Advanced Styling doesn’t start__
  - Click “Style Further” after the first successful generation
  - Look for the Advanced Styling banner above the grid
  - The next modal should say “Adding to your styled image.”
- __No image returned from Gemini__
  - Check browser console logs
  - Verify API key validity, quota, and model availability
- __Product image not appearing__
  - Ensure `imageSrc` filename matches exactly a file in `assets/`
- __Mic not recording / transcription fails__
  - Grant microphone permission in the browser
  - Some browsers require `https://` for microphone access in production
  - Verify `VITE_ELEVENLABS_API_KEY`

## Roadmap
- Region/mask‑based selective editing
- Multi‑product layering in one pass like selecting/dragging multiple products on Try On modal.
- Saved Gallery, share on social media, and download management
- Optional full server pipeline for editing and storage(preferably using fastapi)
- Persist user sessions and saved looks using backend api(preferably using fastapi)
- Generate video from the try-on image using google VEO 3 API.
- Add AI generated product images to the catalog.
- Use more feature for image with FAL(due to no credit, this version doesn't have it at all)

## License
MIT
