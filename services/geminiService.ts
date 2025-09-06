
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

// In Vite, env variables must be prefixed with VITE_
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}
// Image + Text-to-Image (Editing) 
export const editImageWithGemini = async (
  base64ImageData: string,
  mimeType: string,
  productName: string
): Promise<{data: string; mimeType: string} | null> => {
  try {
    console.log("inside editImageWithGemini")
    if (!API_KEY || !ai) {
      throw new Error("Missing VITE_GEMINI_API_KEY. Add it to your .env.local and restart dev server.");
    }
    const model = 'gemini-2.5-flash-image-preview';

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `Realistically edit the first image so the person is wearing a ${productName}. Use any subsequent images only as visual references for color/material/cut. Do not paste or collage any reference image into the result. Do not add thumbnails, borders, or picture-in-picture. Recreate the garment directly on the person with correct fit, drape, lighting, shadows, and perspective. Keep the person's face, body shape, skin tone, hairstyle, pose, and the original background unchanged. Remove or ignore logos/watermarks from references. Return only the edited photo.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const candidates = (response as any)?.candidates || [];
    if (!candidates.length) {
      console.error("Gemini API returned no candidates.", response);
      return null;
    }
    const parts = candidates[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const data = part.inlineData.data as string;
        const mt = part.inlineData.mimeType || mimeType || 'image/png';
        return { data, mimeType: mt };
      }
    }
    console.error("Gemini API did not return an inlineData image part.", response);
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate image. Please check your API key and network connection."
    );
  }
};

// Text-to-Image
export const generateImageFromPrompt = async (
  prompt: string
): Promise<{ data: string; mimeType: string } | null> => {
  try {
    if (!API_KEY || !ai) {
      throw new Error("Missing VITE_GEMINI_API_KEY. Add it to your .env and restart dev server.");
    }
    const model = 'gemini-2.5-flash-image-preview';
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            text: `${prompt}\n\nGenerate a clean e-commerce style product photograph. White or studio-neutral background preferred. Do not add borders, thumbnails, or picture-in-picture. Return only the image.`,
          },
        ],
      },
      // config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });

    const candidates = (response as any)?.candidates || [];
    if (!candidates.length) return null;
    const parts = candidates[0]?.content?.parts || [];
    for (const p of parts) {
      if (p.inlineData && p.inlineData.data) {
        return { data: p.inlineData.data as string, mimeType: p.inlineData.mimeType || 'image/png' };
      }
    }
    return null;
  } catch (error) {
    console.error('generateImageFromPrompt error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate image from prompt.');
  }
};

// Multi-Image to Image (Composition & Style Transfer)
export const editImageWithGeminiComposite = async (
  params: {
    base: { data: string; mimeType: string };
    references?: Array<{ data: string; mimeType: string }>;
    instruction?: string; // optional custom instruction from user (e.g., "put me on ...")
    defaultProductName?: string; // used if instruction is not provided
  }
): Promise<{ data: string; mimeType: string } | null> => {
  try {
    console.log("inside editImageWithGeminiComposite")
    if (!API_KEY || !ai) {
      throw new Error("Missing VITE_GEMINI_API_KEY. Add it to your .env and restart dev server.");
    }
    const model = 'gemini-2.5-flash-image-preview';

    const parts: any[] = [];
    // Product reference image(s) first (to mirror Google sample: references first, then model/user)
    for (const ref of params.references || []) {
      parts.push({ inlineData: { data: ref.data, mimeType: ref.mimeType } });
    }
    // Base (the person/model) last before the text instruction
    parts.push({ inlineData: { data: params.base.data, mimeType: params.base.mimeType } });

    const instructionText =
      params.instruction?.trim() && params.instruction?.length
        ? params.instruction
        : `The first image(s) are the product reference(s). The last image is the person to edit. Realistically make the person wear/use the referenced product(s) with faithful color, material, and proportions${
            params.defaultProductName ? ' (e.g., ' + params.defaultProductName + ')' : ''
          }. Do not paste, collage, or overlay any reference image. No thumbnails, borders, or picture-in-picture. Recreate the clothes directly on the person with correct fit, drape, lighting, shadowing, and perspective. Keep the person's face, pose, body shape, skin tone, hairstyle, and the original background unchanged. Remove or ignore any watermarks/logos from references. Output only the edited photo.`;

    parts.push({ text: instructionText });
    console.log(parts)
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: { parts },
      //config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });

    const candidates = (response as any)?.candidates || [];
    if (!candidates.length) return null;
    const respParts = candidates[0]?.content?.parts || [];
    for (const p of respParts) {
      if (p.inlineData && p.inlineData.data) {
        return { data: p.inlineData.data as string, mimeType: p.inlineData.mimeType || 'image/png' };
      }
    }
    return null;
  } catch (error) {
    console.error('Composite edit error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate composite edit.');
  }
};
