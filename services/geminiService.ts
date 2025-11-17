
import { GoogleGenAI, Type, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const promptGenerationModel = 'gemini-2.5-pro';
const imageGenerationModel = 'gemini-2.5-flash-image';

interface GenerationResult {
  prompts: string[];
  imageUrl: string;
}

export const generatePromptsAndImage = async (baseIdea: string): Promise<GenerationResult> => {
  try {
    // Step 1: Generate creative prompts
    const promptGenerationResponse = await ai.models.generateContent({
      model: promptGenerationModel,
      contents: `بناءً على الفكرة الأساسية "${baseIdea}"، والتي تجمع بين مفاهيم الشباب والإعلام والصحافة والشروق (Sunrise)، قم بإنشاء 4 برومبتات مميزة ومفصلة باللغة العربية لمولد صور بالذكاء الاصطناعي. يجب أن يتم دمج اسم "شباب إعلام الشروق" في الصورة، ربما كنص أنيق أو شعار. ركز على أنماط مختلفة لكل برومبت: 1. نمط رقمي حديث وديناميكي. 2. نمط فني متفائل ومشرق. 3. نمط واقعي يشبه التصوير الصحفي. 4. نمط رمزي وتجريدي.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompts: {
              type: Type.ARRAY,
              description: "An array of 4 detailed image generation prompts in Arabic.",
              items: { type: Type.STRING }
            }
          },
          required: ['prompts']
        },
      },
    });

    const jsonResponseText = promptGenerationResponse.text.trim();
    const parsedResponse = JSON.parse(jsonResponseText);
    const prompts: string[] = parsedResponse.prompts;

    if (!prompts || prompts.length === 0) {
      throw new Error("Failed to generate prompts from the API.");
    }
    
    // Step 2: Generate a preview image using the first creative prompt
    const imageGenerationResponse = await ai.models.generateContent({
      model: imageGenerationModel,
      contents: {
        parts: [{ text: prompts[0] }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    let imageUrl = '';
    for (const part of imageGenerationResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        break; 
      }
    }

    if (!imageUrl) {
        throw new Error("Failed to generate image preview from the API.");
    }

    return { prompts, imageUrl };

  } catch (error) {
    console.error("Error in Gemini service:", error);
    throw new Error("An error occurred while communicating with the Gemini API.");
  }
};
