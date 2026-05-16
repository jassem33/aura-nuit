"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { estAdminAuthentifie } from "@/lib/auth";
import { COMMANDES_TAG, PRODUITS_TAG, produitTag } from "@/lib/produits-public";
import type {
  ArticleCommande,
  Commande,
  CouleurProduit,
  StatutCommande,
} from "@/types/database";

const schemaArticle = z.object({
  produit_id: z.string().min(1),
  nom: z.string().min(1),
  prix_unitaire: z.number().min(0),
  quantite: z.number().int().min(1).max(99),
  couleur: z.string().optional(),
  taille: z.string().optional(),
  image: z.string().optional(),
});

const schemaCommande = z.object({
  nom_client: z.string().min(2, "Nom requis"),
  adresse_client: z.string().min(5, "Adresse requise"),
  telephone_client: z
    .string()
    .min(6, "Téléphone requis")
    .regex(/^[\d\s+().-]+$/, "Numéro de téléphone invalide"),
  articles: z.array(schemaArticle).min(1, "Le panier est vide"),
});

export interface EtatCommande {
  erreur?: string;
  succes?: string;
  commandeId?: string;
  champErreurs?: Record<string, string>;
}

export async function passerCommande(
  _prev: EtatCommande,
  formData: FormData,
): Promise<EtatCommande> {
  let articles: ArticleCommande[] = [];
  const articlesBrut = formData.get("articles");
  if (typeof articlesBrut === "string") {
    try {
      articles = JSON.parse(articlesBrut);
    } catch {
      return { erreur: "Articles invalides." };
    }
  }

  const result = schemaCommande.safeParse({
    nom_client: String(formData.get("nom_client") ?? "").trim(),
    adresse_client: String(formData.get("adresse_client") ?? "").trim(),
    telephone_client: String(formData.get("telephone_client") ?? "").trim(),
    articles,
  });

  if (!result.success) {
    const champErreurs: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!champErreurs[path]) champErreurs[path] = issue.message;
    }
    return { erreur: "Veuillez corriger les champs du formulaire.", champErreurs };
  }

  // Re-vérifier les prix côté serveur (sécurité — ne jamais faire confiance au client).
  const supabase = createSupabaseAdmin();
  const ids = Array.from(new Set(result.data.articles.map((a) => a.produit_id)));
  const { data: produitsDBBrut, error: errProd } = await supabase
    .from("produits")
    .select("id, nom, prix_vente, statut, couleurs, images")
    .in("id", ids);

  if (errProd) {
    return { erreur: `Erreur Supabase : ${errProd.message}` };
  }

  const produitsDB = (produitsDBBrut ?? []) as Array<{
    id: string;
    nom: string;
    prix_vente: number;
    statut: "en stock" | "en rupture";
    couleurs: CouleurProduit[];
    images: unknown;
  }>;
  const carte = new Map(produitsDB.map((p) => [p.id, p]));

  // Agrège la quantité commandée par (produit, couleur). Une couleur vide reste
  // distincte de toute couleur nommée pour les produits sans variantes.
  const quantitesParProduitCouleur = new Map<string, Map<string, number>>();
  for (const a of result.data.articles) {
    const couleur = a.couleur ?? "";
    if (!quantitesParProduitCouleur.has(a.produit_id)) {
      quantitesParProduitCouleur.set(a.produit_id, new Map());
    }
    const m = quantitesParProduitCouleur.get(a.produit_id)!;
    m.set(couleur, (m.get(couleur) ?? 0) + a.quantite);
  }

  let total = 0;
  const articlesValides: ArticleCommande[] = [];

  for (const a of result.data.articles) {
    const p = carte.get(a.produit_id);
    if (!p) {
      return { erreur: `Produit introuvable : ${a.nom}.` };
    }
    if (p.statut !== "en stock") {
      return { erreur: `Produit en rupture : ${p.nom}.` };
    }
    const prix = Number(p.prix_vente);
    total += prix * a.quantite;
    articlesValides.push({
      ...a,
      prix_unitaire: prix,
      nom: p.nom,
    });
  }

  // Vérifie le stock disponible pour chaque (produit, couleur).
  for (const [produitId, parCouleur] of quantitesParProduitCouleur) {
    const p = carte.get(produitId);
    if (!p) continue;
    const couleurs = Array.isArray(p.couleurs) ? p.couleurs : [];
    if (couleurs.length === 0) continue; // pas de variantes : pas de suivi de stock
    for (const [nomCouleur, qte] of parCouleur) {
      if (!nomCouleur) {
        return {
          erreur: `Veuillez choisir une couleur pour ${p.nom}.`,
        };
      }
      const c = couleurs.find((x) => x.nom === nomCouleur);
      if (!c) {
        return {
          erreur: `Couleur indisponible pour ${p.nom} : ${nomCouleur}.`,
        };
      }
      const dispo = Number(c.stock ?? 0);
      if (dispo < qte) {
        return {
          erreur: `Stock insuffisant pour ${p.nom} (${nomCouleur}) : reste ${dispo}.`,
        };
      }
      // Vérifie que la taille demandée existe pour cette couleur.
      const taillesCouleur = Array.isArray(c.tailles) ? c.tailles : [];
      if (taillesCouleur.length > 0) {
        const articlesCouleur = result.data.articles.filter(
          (a) => a.produit_id === produitId && (a.couleur ?? "") === nomCouleur,
        );
        for (const a of articlesCouleur) {
          if (!a.taille) {
            return {
              erreur: `Veuillez choisir une taille pour ${p.nom} (${nomCouleur}).`,
            };
          }
          if (!taillesCouleur.includes(a.taille)) {
            return {
              erreur: `Taille indisponible pour ${p.nom} (${nomCouleur}) : ${a.taille}.`,
            };
          }
        }
      }
    }
  }

  total = Math.round(total * 100) / 100;

  const payloadCommande = {
    nom_client: result.data.nom_client,
    adresse_client: result.data.adresse_client,
    telephone_client: result.data.telephone_client,
    articles: articlesValides,
    total,
    statut: "en attente",
  };
  const { data: insertionBrut, error } = await supabase
    .from("commandes")
    .insert(payloadCommande as never)
    .select("id")
    .single();
  const insertion = insertionBrut as { id: string } | null;

  if (error || !insertion) {
    return { erreur: `Erreur Supabase : ${error?.message ?? "inconnue"}` };
  }

  const produitsImpactes: string[] = [];
  for (const [produitId, parCouleur] of quantitesParProduitCouleur) {
    const p = carte.get(produitId);
    if (!p) continue;
    const couleurs = Array.isArray(p.couleurs) ? p.couleurs : [];
    if (couleurs.length === 0) continue;

    const nouvellesCouleurs: CouleurProduit[] = couleurs.map((c) => {
      const qte = parCouleur.get(c.nom) ?? 0;
      const stockActuel = Number(c.stock ?? 0);
      return {
        ...c,
        stock: Math.max(0, stockActuel - qte),
      };
    });

    const totalRestant = nouvellesCouleurs.reduce(
      (s, c) => s + Number(c.stock ?? 0),
      0,
    );
    const maj: {
      couleurs: CouleurProduit[];
      statut?: "en stock" | "en rupture";
    } = { couleurs: nouvellesCouleurs };
    if (totalRestant === 0) {
      maj.statut = "en rupture";
    }

    const { error: errMaj } = await supabase
      .from("produits")
      .update(maj as never)
      .eq("id", produitId);
    if (errMaj) {
      console.error(
        `Échec mise à jour stock pour ${produitId} :`,
        errMaj.message,
      );
      continue;
    }
    produitsImpactes.push(produitId);
  }

  revalidateTag(COMMANDES_TAG);
  if (produitsImpactes.length > 0) {
    revalidateTag(PRODUITS_TAG);
    for (const pid of produitsImpactes) revalidateTag(produitTag(pid));
  }
  revalidatePath("/admin/commandes");
  revalidatePath("/admin/produits");
  revalidatePath("/boutique");
  return { succes: "Commande enregistrée.", commandeId: insertion.id };
}

export async function mettreAJourStatutCommande(
  id: string,
  statut: StatutCommande,
): Promise<void> {
  if (!estAdminAuthentifie()) {
    throw new Error("Non autorisé.");
  }
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("commandes")
    .update({ statut } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/commandes");
  revalidatePath("/admin");
}

export async function listerCommandes(): Promise<Commande[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("commandes")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Commande[];
}

export async function obtenirCommande(id: string): Promise<Commande | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("commandes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as Commande | null) ?? null;
}
