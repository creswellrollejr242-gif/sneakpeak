import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => new GoogleGenerativeAI(process.env.API_KEY || "");

/**
 * AI Legit Check for sneakers
 */
export const checkLegitimacy = async (base64Image: string) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const prompt = `Analyze this sneaker image for authenticity. Check stitching, shape, materials, and logo placement. 
            Return a JSON object with: {"verdict": "PASS" | "FAIL" | "UNCERTAIN", "confidence": number, "reasoning": string, "details": string[]}`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      }
    ]);
    
    const response = await result.response;
    const jsonStr = response.text().replace(/```json|```/g, '').trim();
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
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const prompt = `Provide trendy outfit advice for: "${sneakerName}". Return JSON: {"fit": "string", "color": "string"}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = response.text().replace(/```json|```/g, '').trim();
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
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: "You are KickFlip, an expert sneaker head concierge. Be helpful and concise.",
    });

    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.parts[0].text }],
      })),
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;

    return { text: response.text(), sources: [] };
  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "Connection error.", sources: [] };
  }
};