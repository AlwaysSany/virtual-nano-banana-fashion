# Virtual Fashion Try‑On

An AI‑powered web app that lets users virtually try on fashion items (shirts, pants/jeans, shoes, hats, eyewear) using their own photo. Users can continue styling a generated image with additional items using the Advanced Styling mode.

## Features
- Searchable, filterable product catalog (outerwear, hats, eyewear, shoes, shirts, pants)
- Try Now modal to upload a photo and generate a realistic try‑on
- Advanced Styling mode to add more products on top of the latest generated result
- Solarized‑dark theme, responsive UI, accessible focus states
- Assets‑driven catalog (images in `assets/`); no emojis

## Architecture
- Frontend: React + Vite
- Styling: Tailwind via CDN (see `index.html`)
- Image editing: Google Gemini 2.5 Flash (image preview) via `@google/genai`
- Data: `constants.ts` contains categories and products referencing `assets/`

## Project Structure
```
virtual-nano-banana-fashion/
├─ assets/                      # Product images (catalog sources)
├─ components/                  # React components
│  ├─ AdvancedStylePreview.tsx
│  ├─ CategoryFilter.tsx
│  ├─ Header.tsx
│  ├─ ProductCard.tsx
│  ├─ ProductGrid.tsx
│  ├─ SearchBar.tsx
│  ├─ Spinner.tsx
│  └─ TryOnModal.tsx
├─ services/
│  └─ geminiService.ts          # Gemini 2.5 Flash image edit call
├─ App.tsx                      # App shell, filters, modal state, advanced styling
├─ constants.ts                 # Categories + product catalog (images only)
├─ types.ts                     # TS types (Product, Category)
├─ index.html                   # Vite entry + Tailwind CDN + import maps
├─ index.tsx                    # React mount
├─ .env                         # Local environment (VITE_GEMINI_API_KEY)
└─ README.md                    # This file
```

## Setup
### Prerequisites
- Node.js 18+

### 1) Install
```bash
npm install
```

### 2) Environment
Create or update `.env` at the project root:
```bash
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
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


## Troubleshooting
- Missing key
  - Ensure `.env` has `VITE_GEMINI_API_KEY=...`
  - Restart the dev server after editing `.env`
- Advanced Styling doesn’t start
  - Click “Style Further” after the first successful generation
  - Look for the Advanced Styling banner above the grid
  - The next modal should say “Adding to your styled image.”
- No image returned from Gemini
  - Check browser console logs
  - Verify API key validity, quota, and model availability
- Product image not appearing
  - Ensure `imageSrc` filename matches exactly a file in `assets/`

## Roadmap
- Region/mask‑based selective editing
- Multi‑product layering in one pass
- Gallery, share, and download management
- Optional full server pipeline (FastAPI) for editing and storage
- Persist user sessions and saved looks

## License
MIT
