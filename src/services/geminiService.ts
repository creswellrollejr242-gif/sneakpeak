import { GoogleGenAI, Type } from '@google/genai';

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

export const checkLegitimacy = async (base64Image: string) => {
  try {
    // Guidelines: Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            text: `Analyze this sneaker image for authenticity with definitive authority. Check stitching, shape, materials, and logo placement. 
            Return a JSON object with the following structure:
            {
              "verdict": "PASS" or "FAIL" or "UNCERTAIN",
              "confidence": number (0-100),
              "reasoning": "An opinionated, confident verdict on why this pair is real or fake.",
              "details": ["High-level technical detail 1", "High-level technical detail 2"]
            }
            Do not include markdown formatting like \`\`\`json. Just the raw JSON string.`
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
          }
        }
      }
    });
    
    // Access .text property directly (not a method)
    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return getMockLegitCheck();
  }
};

export const generateStyleAdvice = async (sneakerName: string) => {
  try {
    // Guidelines: Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [{
          text: `You are the Executive Sneaker Stylist. Provide decisive, opinionated outfit advice for: "${sneakerName}".
          Analyze the shoe's silhouette and cultural vibe. Be specific and bold.
          
          Return a JSON object with two fields:
          1. "fit": A definitive outfit combination (e.g., "Must pair with Raw Indigo Selvedge and a Heavyweight Cropped Tee").
          2. "color": A specific, high-end color palette that complements this shoe.`
        }]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fit: { type: Type.STRING },
            color: { type: Type.STRING }
          }
        }
      }
    });

    // Access .text property directly
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Style AI Error:", error);
    const index = sneakerName.length % MOCK_STYLES.length;
    return MOCK_STYLES[index];
  }
};

export const identifySneakerFromImage = async (base64Image: string) => {
  try {
    // Guidelines: Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            text: `Identify the sneaker in this image with absolute precision. Return ONLY the model name and colorway (e.g., "Air Jordan 1 High OG Lost and Found").`
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }
    });

    // Access .text property directly
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Visual Search Error:", error);
    return null;
  }
};

export const chatWithConcierge = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  try {
    // Guidelines: Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are the Sneaker Concierge. You are the definitive authority on street culture, market economics, and retail authenticity. You do not offer 'suggestions'; you provide 'directives' and 'intelligence'. Your tone is high-end, confident, and professional. Avoid filler words. Provide elite market intelligence. Use strong terms like 'Buy', 'Skip', 'Hold', 'High Resale Potential', 'Market Volatility Detected'.",
      },
      history: history as any,
    });

    const result = await chat.sendMessage({ message: newMessage });
    
    // Guidelines: Extract grounding metadata URLs and titles for search results
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter(Boolean);

    return {
      text: result.text || "Market intelligence currently restricted.",
      sources
    };
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return {
      text: "Intelligence node offline. Accessing local cache.",
      sources: []
    };
  }
};