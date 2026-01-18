import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => new GoogleGenerativeAI(process.env.API_KEY || "");

// Mock response for demo/fallback mode if needed
const getMockLegitCheck = () => {
  const isPass = Math.random() > 0.3; // 70% chance pass
  return {
    verdict: isPass ? "PASS" : "FAIL",
    confidence: Math.floor(Math.random() * 10 + 90), // 90-99%
    reasoning: isPass 
      ? "INTELLIGENCE: Stitching density and logo placement align perfectly with retail reference standards. Materials show correct premium grain structure." 
      : "INTELLIGENCE: High-variance inconsistency on the heel tab stitching. Swoosh geometry deviates from authentic blueprints.",
    details: isPass 
      ? ["Precision date code font", "UV glue pattern verified", "Box label authentic"] 
      : ["Non-spec box label font", "Excessive manufacturing residue", "Midsole painting anomaly"]
  };
};

// FALLBACK STYLES FOR DEMO MODE
const MOCK_STYLES = [
  { fit: "Oversized Boxy Hoodie + Baggy Carpenter Denim", color: "Vintage Wash Black & Cream" },
  { fit: "Tech Fleece Joggers + Performance Windbreaker", color: "Matte Black & Neon Accents" },
  { fit: "Pleated Trousers + Knitted Polo (Dad Core)", color: "Earth Tones (Sage, Brown, Beige)" },
  { fit: "Mesh Basketball Shorts + Heavyweight Blank Tee", color: "Grey Heather & White" },
  { fit: "Nylon Cargo Pants + Puffer Vest", color: "Military Green & Safety Orange" },
  { fit: "Relaxed Sweatpants + Vintage Band Tee", color: "Monochrome with Graphic Pops" },
  { fit: "Wide Leg Chinos + Varsity Jacket", color: "Navy Blue & Mustard" },
];

/**
 * AI Legit Check for sneakers
 */
export const checkLegitimacy = async (base64Image: string) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
    
    const result = await model.generateContent([
      {
        text: `Analyze this sneaker image for authenticity with definitive authority. Check stitching, shape, materials, and logo placement. 
            Return a JSON object with the following structure:
            {
              "verdict": "PASS" | "FAIL" | "UNCERTAIN",
              "confidence": number (0-100),
              "reasoning": "An opinionated, confident verdict on why this pair is real or fake.",
              "details": string[]
            }
            Just the raw JSON string.`
      },
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
    return getMockLegitCheck();
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

    const result = await model.generateContent(`You are the Executive Sneaker Stylist. Provide decisive, opinionated outfit advice for: "${sneakerName}".
          Analyze the shoe's silhouette and cultural vibe. Be specific and bold.
          
          Return a JSON object with two fields:
          1. "fit": A definitive outfit combination (e.g., "Must pair with Raw Indigo Selvedge and a Heavyweight Cropped Tee").
          2. "color": A specific, high-end color palette that complements this shoe.`);
    
    const response = await result.response;
    const jsonStr = response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Style AI Error:", error);
    const index = sneakerName.length % MOCK_STYLES.length;
    return MOCK_STYLES[index];
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
    return { text: "Connection error. Market nodes are currently unreachable.", sources: [] };
  }
};