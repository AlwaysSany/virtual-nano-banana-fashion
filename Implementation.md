I am planning to build an ai powering web-based virtual fashion try-on app.
The user interface allows people to search for and select fashion products (e.g., T-shirt, pants, jeans, trousers, shoes, caps, sunglasses, or other accessories).

When the user clicks on a product and selects “Try Now”, they can upload their own photo (or use an existing one). Your job is to take the uploaded image and edit it so the person appears to be wearing/using the selected product(s). The another feature is where on the generated image user can pick other products to decorate himself/herself, e.g after trying the tshirts he/she want to try the sunglasses, then try shoe etc.

---
🖥️ Web App Context:
- Products are displayed in a searchable grid or list on the front end.
- Each product card has a “Try Now” button.
- Clicking “Try Now” opens an upload dialog (user can add their own photo).
- The backend then calls you (the image editor) with the uploaded photo and selected product(s).
- it will use Google Gemini 2.5-flash model, here is some examples of Jupiter notebook, https://github.com/AlwaysSany/nano-banana-hackathon-kit/blob/fix/file-not-found-error/guides/02-use-nano-banana.ipynb
- The generated try-on image is displayed back to the user with an option to save, share, or retry.
- There should be another option called advanced style, where user can pick his/her existing saved image to try another product to decorate.

---
🎨 Image Editing Rules:
- Keep the person’s face, body shape, skin tone, hairstyle, and background unchanged unless instructed otherwise.
- Realistically blend the selected product(s) into the image with proper lighting, shadows, and proportions.
- Maintain fabric textures, wrinkles, folds, and correct fitting for clothes.
- Accessories (caps, sunglasses, shoes, jewelry, watches) must align naturally with the body part.
- Do not distort or alter unrelated parts of the photo.

---
📦 Editing Cases:

Case 1: Single Product Try-On
- Product: [PRODUCT_NAME]
- Replace or overlay the current clothing/accessory with the chosen one.
- Example: If the user selects “blue ripped jeans,” edit the lower body clothing accordingly.

Case 2: Multiple Products Try-On
- Products: [LIST_OF_PRODUCTS]
- Apply all selected items together with correct layering (e.g., T-shirt under jacket, shoes at the feet).
- Make sure the combined outfit looks consistent and realistic.

Case 3: Mask/Region Editing
- If the user highlights/masks a region, only replace that area with the chosen product.
- Keep all other areas intact.
- Blend smoothly at the edges for realism.

---
✅ Final Output:
- A web app with react as frontend and python as backend where image of the original person now wearing/using the selected fashion item(s).
- No distortions, artifacts, or artificial-looking edits.
- Preserve the person’s identity and environment.

i have created a sample html web page for initial step now my next step is like below,
1. create a frontend with react to convert this html to component based web app
2. create a backend with fast api that will do the all image operations using google gemini 2.5 flash model that will be invoked from frontend during product try on.

---

# Kaggle Writeup

## Project Title
Virtual Nano Banana: High-Fidelity AI Fashion Try‑On with Gemini 2.5 Flash Image

## Problem Statement (≤200 words)
This web app demonstrates a realistic AI fashion try‑on pipeline using Gemini 2.5 Flash Image, with the model integrated directly into end‑user flows rather than as isolated demos. In `components/AddProductModal.tsx`, we use text‑to‑image to generate clean catalog photos from short prompts (e.g., “orange high‑top sneakers on a white background”). The same modal optionally applies a brand/logo in a high‑fidelity step by calling `editImageWithGeminiComposite()` with the logo as a reference and the generated product as the base, using instructions that preserve garment details while blending the logo with correct folds, texture, lighting, and perspective.

Once a product exists (either from our static `constants.ts` or just added in‑session), users open `components/TryOnModal.tsx` to “wear” it. We prioritize the composite flow by passing the product image as a reference and the user photo as the base, with prompts tuned to avoid collage and to keep identity, pose, skin tone, hair, and background unchanged. Users can iteratively refine results via the “Put me on” input, which issues follow‑up edits on the latest output, enabling multi‑turn adjustments (e.g., add sunglasses, tweak color).

Downloads and sharing are supported for quick review. Overall, by chaining generation, high‑fidelity logo application, catalog use, try‑on, and iterative refinement, the app shows how Gemini’s visual capabilities power a cohesive, production‑style try‑on experience.