import { GoogleGenAI, Type } from '@google/genai';

/**
 * AI Legit Check for sneakers
 */
export const checkLegitimacy = async (base64Image: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
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
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            details: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["verdict", "confidence", "reasoning"]
        }
      }
    });
    
    // Access .text property directly (not a method)
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return { verdict: "ERROR", confidence: 0, reasoning: "Vision engine offline." };
  }
};

/**
 * AI Outfit Recommendations
 */
export const generateStyleAdvice = async (sneakerName: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide trendy outfit advice for: "${sneakerName}". Return JSON: {"fit": "string", "color": "string"}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: { fit: { type: Type.STRING }, color: { type: Type.STRING } }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { fit: "Oversized fit", color: "Neutrals" };
  }
};

/**
 * Chat concierge with Google Search grounding
 */
export const chatWithConcierge = async (history: any[], newMessage: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are KickFlip, an expert sneaker head concierge. Be helpful and concise.",
        tools: [{ googleSearch: {} }]
      },
      history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter(Boolean);

    return { text: result.text || "I'm not sure.", sources };
  } catch (error) {
    return { text: "Connection error.", sources: [] };
  }
};