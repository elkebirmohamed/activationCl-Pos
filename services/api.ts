
import { GoogleGenAI } from "@google/genai";
import { LicenseData } from '../types';

/**
 * Service de génération de licence POS.AI via Gemini.
 * Utilise process.env.API_KEY injecté par l'environnement de build.
 */
export const generateLicenseKey = async (machineId: string): Promise<LicenseData> => {
  try {
    // Dans Vite, les variables d'environnement sont souvent accessibles via import.meta.env
    // Mais les consignes imposent process.env.API_KEY. On utilise une approche hybride sécurisée.
    const apiKey = (process.env as any)?.API_KEY;

    if (!apiKey) {
      console.warn("Clé API absente. Vérifiez vos variables d'environnement sur Vercel.");
      throw new Error("MISSING_API_KEY");
    }

    // Initialisation obligatoire selon les règles : new GoogleGenAI({ apiKey: ... })
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Génère une clé de licence unique et complexe pour le terminal POS.AI (Machine ID: ${machineId}). 
      Format strictement requis: PAI-XXXX-XXXX-XXXX-XXXX (mélange de chiffres et lettres majuscules). 
      Réponds uniquement avec la clé de licence.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 30,
      }
    });

    // Accès à la propriété .text comme spécifié
    const key = response.text?.trim() || `PAI-GEN-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    return {
      key: key,
      generatedAt: new Date().toISOString(),
      status: 'ACTIVE'
    };
  } catch (error) {
    console.info("Info: Utilisation du générateur de secours local.");
    // Fallback local robuste
    const chunk = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return {
      key: `PAI-${chunk()}-${chunk()}-${chunk()}-${chunk()}`,
      generatedAt: new Date().toISOString(),
      status: 'ACTIVE'
    };
  }
};
