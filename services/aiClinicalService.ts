
import { GoogleGenAI, Type } from "@google/genai";
import { PatientProfile } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper per convertire file in Base64
export const fileToGenerativePart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const AiClinicalService = {

  /**
   * Genera un referto medico formale partendo da appunti grezzi.
   */
  async generateReport(patient: PatientProfile, rawNotes: string, visitType: string): Promise<string> {
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      Sei il Dr. Federico Grilli, specialista in Genetica Medica.
      Compito: Genera un referto medico formale e dettagliato basato sugli appunti grezzi forniti.
      
      DATI PAZIENTE:
      Nome: ${patient.registry.firstName} ${patient.registry.lastName}
      Codice Fiscale: ${patient.registry.fiscalCode}
      
      TIPO VISITA: ${visitType}
      
      APPUNTI GREZZI:
      "${rawNotes}"
      
      ISTRUZIONI FORMATTAZIONE:
      - Usa un tono medico, professionale, empatico ma distaccato.
      - Struttura: "Motivo della visita", "Anamnesi Familiare e Personale", "Valutazione Clinica", "Conclusioni e Raccomandazioni".
      - Non inventare dati non presenti negli appunti, ma elabora quelli presenti in prosa medica corretta.
      - Se mancano dati critici, segnalalo tra parentesi quadre.
      - Formatta in Markdown pulito.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.3 } // Bassa temperatura per precisione
      });
      return response.text || "Errore nella generazione del referto.";
    } catch (error) {
      console.error("AI Report Error:", error);
      throw error;
    }
  },

  /**
   * Analizza un documento caricato ed estrae dati strutturati.
   */
  async analyzeDocument(file: File): Promise<any> {
    const model = 'gemini-3-flash-preview'; // Multimodale ottimizzato
    const filePart = await fileToGenerativePart(file);

    const prompt = `
      Analizza questo documento medico. 
      Estrai le seguenti informazioni in formato JSON rigoroso:
      1. 'documentType': Tipo di documento (es. Esame del Sangue, Referto Genetico, Ecografia).
      2. 'date': Data del referto (formato YYYY-MM-DD).
      3. 'patientName': Nome del paziente se visibile.
      4. 'summary': Un riassunto clinico di 2 frasi.
      5. 'criticalValues': Array di stringhe con eventuali valori fuori norma o degni di nota.
      6. 'suggestedAction': Un suggerimento per il Dr. Grilli (es. "Richiede visita controllo", "Archiviazione").
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              filePart,
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              documentType: { type: Type.STRING },
              date: { type: Type.STRING },
              patientName: { type: Type.STRING },
              summary: { type: Type.STRING },
              criticalValues: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedAction: { type: Type.STRING }
            }
          }
        }
      });
      
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("AI Analysis Error:", error);
      throw error;
    }
  }
};
