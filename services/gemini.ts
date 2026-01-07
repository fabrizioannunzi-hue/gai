
import { GoogleGenAI, Content, Part, Tool, Type } from "@google/genai";
import { Message, Role } from '../types';
import { buildMasterPrompt } from './aiPromptService';

export const toolsDef: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "openBookingCalendar",
        description: "Apre il widget di prenotazione Calendly o la pagina di prenotazione dello studio.",
        parameters: { type: Type.OBJECT, properties: {} }
      }
    ]
  }
];

export interface GeminiResponse {
  text: string;
  triggerCalendar: boolean;
}

export const sendMessageToGemini = async (history: Message[], newMessage: string): Promise<GeminiResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = buildMasterPrompt(false); 

    const contents: Content[] = history.map((msg) => ({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.text } as Part],
    }));

    contents.push({ role: 'user', parts: [{ text: newMessage } as Part] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: { 
        systemInstruction, 
        tools: toolsDef,
        temperature: 0.0, // Enterprise setting: Zero Creativity, Max Precision
      },
    });

    const hasFunctionCall = response.candidates?.[0]?.content?.parts?.some(p => p.functionCall?.name === 'openBookingCalendar');

    return {
      text: response.text || (hasFunctionCall ? "Certamente, apro subito il calendario per lei." : "Mi scusi, ho riscontrato un'interferenza."),
      triggerCalendar: !!hasFunctionCall
    };
  } catch (error) {
    console.error("GEMINI ERROR:", error);
    return { text: "Sincronia interrotta. Riprovare.", triggerCalendar: false };
  }
};
