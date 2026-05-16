"use server";

import { z } from "zod";

export interface EtatContact {
  succes?: string;
  erreur?: string;
  champErreurs?: Record<string, string>;
}

const schemaContact = z.object({
  nom: z.string().min(1, "Le nom est requis").max(120),
  email: z.string().email("Email invalide"),
  sujet: z.string().max(200).optional().default(""),
  message: z.string().min(5, "Message trop court").max(2000),
});

export async function envoyerMessageContact(
  _prev: EtatContact,
  formData: FormData,
): Promise<EtatContact> {
  const brut = {
    nom: String(formData.get("nom") ?? ""),
    email: String(formData.get("email") ?? ""),
    sujet: String(formData.get("sujet") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const result = schemaContact.safeParse(brut);
  if (!result.success) {
    const champErreurs: Record<string, string> = {};
    for (const issue of result.error.issues) {
      champErreurs[issue.path.join(".")] = issue.message;
    }
    return { erreur: "Veuillez corriger les champs en erreur.", champErreurs };
  }

  // Journalisation côté serveur — à brancher sur un service d'envoi (email,
  // table Supabase « messages », webhook…) selon vos besoins.
  console.log("[contact] nouveau message", result.data);

  return {
    succes:
      "Votre message a bien été envoyé. Nous vous répondrons sous 24 heures.",
  };
}
