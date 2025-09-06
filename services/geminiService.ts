
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

// In Vite, env variables must be prefixed with VITE_
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const editImageWithGemini = async (
  base64ImageData: string,
  mimeType: string,
  productName: string
): Promise<{data: string; mimeType: string} | null> => {
  try {
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
            text: `Realistically edit the image to make the person wear a ${productName}. Keep the person's face, body shape, skin tone, hairstyle, and background unchanged. Blend the item naturally with proper lighting, shadows, and proportions. Do not distort or alter unrelated parts of the photo.`,
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
