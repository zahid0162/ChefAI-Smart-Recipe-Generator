
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const RECIPE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Catchy recipe title" },
      description: { type: Type.STRING, description: "Short appetizing summary" },
      ingredients: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of ingredients with measurements"
      },
      instructions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Step-by-step cooking steps"
      },
      prepTime: { type: Type.STRING, description: "e.g., 15 mins" },
      cookTime: { type: Type.STRING, description: "e.g., 30 mins" },
      servings: { type: Type.INTEGER },
      difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
      nutrition: {
        type: Type.OBJECT,
        properties: {
          calories: { type: Type.INTEGER },
          protein: { type: Type.STRING },
          carbs: { type: Type.STRING },
          fat: { type: Type.STRING }
        },
        required: ["calories", "protein", "carbs", "fat"]
      },
      imagePrompt: { type: Type.STRING, description: "A detailed descriptive prompt to generate a photo of this dish" }
    },
    required: ["title", "description", "ingredients", "instructions", "prepTime", "cookTime", "servings", "difficulty", "nutrition", "imagePrompt"],
    propertyOrdering: ["title", "description", "ingredients", "instructions", "prepTime", "cookTime", "servings", "difficulty", "nutrition", "imagePrompt"]
  }
};

export const generateRecipesFromIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  const prompt = `Act as a Michelin star chef. Generate 3 creative recipes using primarily these ingredients: ${ingredients.join(", ")}. 
  You can include common pantry staples (salt, oil, pepper, water, flour). 
  Focus on diverse cuisines and healthy options.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RECIPE_SCHEMA,
      },
    });

    const results = JSON.parse(response.text || "[]");
    return results.map((r: any, idx: number) => ({ ...r, id: `recipe-${idx}-${Date.now()}` }));
  } catch (error) {
    console.error("Recipe generation failed:", error);
    throw new Error("Failed to cook up some recipes. Please try again!");
  }
};

export const extractIngredientsFromImage = async (base64Image: string): Promise<string[]> => {
  const prompt = "Identify all the food ingredients, fruits, vegetables, proteins, and pantry items visible in this image. List them as a simple comma-separated string of ingredient names only.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1] || base64Image
          }
        },
        { text: prompt }
      ]
    });

    const text = response.text || "";
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    console.error("Image analysis failed:", error);
    throw new Error("Could not see any ingredients in the photo. Try typing them instead!");
  }
};
