import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction for the chat assistant
const CHAT_SYSTEM_INSTRUCTION = `You are an expert travel consultant for "Pavan Hans Tours and Travel". 
Your goal is to help users plan trips, suggest destinations based on their preferences, and provide travel tips. 
Be polite, professional, and enthusiastic. Keep answers concise (under 100 words) unless asked for an itinerary.`;

// Schema for generating structured tour data
const TOUR_GENERATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "A captivating marketing description of the tour (approx 50-80 words).",
    },
    highlights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 4-5 key highlights or activities included in the tour.",
    },
    estimatedPrice: {
      type: Type.NUMBER,
      description: "An estimated price in USD for this type of tour per person.",
    },
    suggestedDuration: {
      type: Type.STRING,
      description: "Recommended duration, e.g., '5 Days / 4 Nights'.",
    }
  },
  required: ["description", "highlights", "estimatedPrice", "suggestedDuration"],
};

export const generateTourDetails = async (destination: string, title: string) => {
  if (!apiKey) throw new Error("API Key is missing");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a travel package plan for: ${title} in ${destination}. 
      Make it sound luxurious and exciting.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: TOUR_GENERATION_SCHEMA,
        systemInstruction: "You are a backend content generator for a travel agency.",
      },
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("GenAI Tour Generation Error:", error);
    throw error;
  }
};

export const getChatResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  if (!apiKey) throw new Error("API Key is missing");

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("GenAI Chat Error:", error);
    return "I'm having trouble connecting to the travel network right now. Please try again later.";
  }
};
