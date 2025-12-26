import { GoogleGenAI, Type } from "@google/genai";
import { InvoiceData, LineItem } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const parseInvoiceFromText = async (text: string, currentData: InvoiceData): Promise<Partial<InvoiceData>> => {
  const ai = getClient();
  
  const prompt = `
    You are an expert data entry assistant. 
    Extract invoice details from the following unstructured text.
    Map the information to a JSON structure compatible with an invoice application.
    
    Current Date: ${new Date().toISOString().split('T')[0]}
    
    User Text: "${text}"
    
    Instructions:
    - Extract sender and client details if available.
    - Extract line items (description, quantity, price). If only a total is given, try to infer price/qty.
    - Extract dates or payment terms.
    - If specific fields are missing, omit them or return null/empty string. Do not invent data unless reasonably inferred (e.g., today's date).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            invoiceNumber: { type: Type.STRING, nullable: true },
            senderName: { type: Type.STRING, nullable: true },
            senderAddress: { type: Type.STRING, nullable: true },
            senderEmail: { type: Type.STRING, nullable: true },
            clientName: { type: Type.STRING, nullable: true },
            clientAddress: { type: Type.STRING, nullable: true },
            clientEmail: { type: Type.STRING, nullable: true },
            date: { type: Type.STRING, nullable: true },
            dueDate: { type: Type.STRING, nullable: true },
            paymentTerms: { type: Type.STRING, nullable: true },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  price: { type: Type.NUMBER },
                },
                required: ["description", "quantity", "price"],
              }
            },
            taxRate: { type: Type.NUMBER, nullable: true },
            notes: { type: Type.STRING, nullable: true },
          }
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      
      // Post-processing to ensure IDs exist for items
      const itemsWithIds = parsed.items?.map((item: any) => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9)
      })) || [];

      return {
        ...parsed,
        items: itemsWithIds.length > 0 ? itemsWithIds : undefined,
      };
    }
    return {};
  } catch (error) {
    console.error("Gemini parsing error:", error);
    throw error;
  }
};
