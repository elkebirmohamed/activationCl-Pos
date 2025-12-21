import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Initialisation du service d'email
const resend = new Resend(process.env.RESEND_API_KEY);

// Algorithme de hachage (Strictement identique à votre app Smart POS)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Le Webhook ne répond qu'aux appels POST de PayPal
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // 1. Extraction des données envoyées par PayPal via le custom_id
    const resource = req.body.resource;
    const custom_id = resource?.custom_id;

    if (!custom_id) {
      console.error("Données personnalisées manquantes dans la requête PayPal");
      return res.status(400).send('Erreur: custom_id manquant');
    }

    // Séparation du MachineID et de l'Email
    const [machineId, email] = custom_id.split('|');

    // 2. Génération de la clé de licence (Algorithme POS-LICENSE-2024)
    const salt = 'POS-LICENSE-2024';
    const combined = `${machineId}-${salt}`;
    const hash = simpleHash(combined);
    
    const rawKey = hash.toUpperCase().padStart(16, '0');
    const finalLicenseKey = `${rawKey.slice(0, 4)}-${rawKey.slice(4, 8)}-${rawKey.slice(8, 12)}-${rawKey.slice(12, 16)}`;

    // 3. Envoi de l'email automatique avec Resend
    await resend.emails.send({
      from: 'POS.AI Activation <activation@votre-domaine.com>', // Remplacez par votre domaine plus tard
      to: email,
      subject: '🔑 Votre Clé d\'activation POS.AI',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px;">
          <h1 style="color: #4f46e5; text-align: center;">Félicitations !</h1>
          <p>Merci pour votre achat. Votre logiciel est prêt à être activé.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p><strong>Terminal ID :</strong> ${machineId}</p>
          <p><strong>Votre Clé de Licence :</strong></p>
          <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #1e293b; letter-spacing: 3px; border-radius: 12px; margin: 20px 0;">
            ${finalLicenseKey}
          </div>
          <p style="font-size: 14px; color: #64748b;">Copiez ce code et collez-le dans la fenêtre d'activation de votre application POS.AI.</p>
          <div style="text-align: center; margin-top: 30px;">
            <small>&copy; 2025 POS.AI Global Systems</small>
          </div>
        </div>
      `
    });

    console.log(`Clé envoyée avec succès à ${email} pour le terminal ${machineId}`);
    return res.status(200).json({ status: 'success' });

  } catch (error: any) {
    console.error('Erreur Webhook:', error.message);
    return res.status(500).json({ error: 'Erreur interne lors de la génération' });
  }
}
