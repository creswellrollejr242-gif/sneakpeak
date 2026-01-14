
import { GoogleGenAI } from "@google/genai";

/**
 * AI Legit Check for sneakers
 */
export const checkLegitimacy = async (base64Image: string) => {
  try {
    // FIX: Always use new GoogleGenAI({apiKey: process.env.API_KEY}) as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // FIX: Use ai.models.generateContent with appropriate model and access .text property.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          text: `Analyze this sneaker image for authenticity. Check stitching, shape, materials, and logo placement. 
            Return a JSON object with: {"verdict": "PASS" | "FAIL" | "UNCERTAIN", "confidence": number, "reasoning": string, "details": string[]}`
        },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });
    
    // FIX: Access response.text property directly
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return { verdict: "ERROR", confidence: 0, reasoning: "Vision engine offline.", details: [] };
  }
};

/**
 * AI Outfit Recommendations
 */
export const generateStyleAdvice = async (sneakerName: string) => {
  try {
    // FIX: Initialization must use named parameter apiKey
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide trendy outfit advice for: "${sneakerName}". Return JSON: {"fit": "string", "color": "string"}`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    // FIX: Access response.text property directly
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Style advice error:", error);
    return { fit: "Oversized fit", color: "Neutrals" };
  }
};

/**
 * Chat concierge
 */
export const chatWithConcierge = async (history: any[], newMessage: string) => {
  try {
    // FIX: Initialization must use named parameter apiKey
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // FIX: Use ai.chats.create for conversational flow
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are KickFlip, an expert sneaker head concierge. Be helpful and concise.",
      },
      history: history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.parts[0].text }],
      })),
    });

    // FIX: sendMessage takes a message parameter. Access text via .text property.
    const response = await chat.sendMessage({ message: newMessage });

    return { text: response.text || '', sources: [] };
  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "Connection error.", sources: [] };
  }
};
