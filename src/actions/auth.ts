"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  cookieAdminNom,
  creerJetonSession,
  dureeSessionSecondes,
  verifierMotDePasse,
} from "@/lib/auth";

export interface EtatConnexion {
  erreur?: string;
}

export async function connecterAdmin(
  _prevState: EtatConnexion,
  formData: FormData,
): Promise<EtatConnexion> {
  const motDePasse = String(formData.get("mot_de_passe") ?? "");
  const redirection = String(formData.get("redirect") ?? "/admin");

  if (!motDePasse) {
    return { erreur: "Veuillez saisir le mot de passe." };
  }

  let valide = false;
  try {
    valide = verifierMotDePasse(motDePasse);
  } catch (err) {
    return {
      erreur:
        "Configuration serveur invalide. Vérifiez ADMIN_PASSWORD dans .env.local.",
    };
  }

  if (!valide) {
    return { erreur: "Mot de passe incorrect." };
  }

  const jeton = creerJetonSession();
  cookies().set(cookieAdminNom(), jeton, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: dureeSessionSecondes(),
  });

  redirect(redirection.startsWith("/admin") ? redirection : "/admin");
}

export async function deconnecterAdmin() {
  cookies().delete(cookieAdminNom());
  redirect("/admin/login");
}
