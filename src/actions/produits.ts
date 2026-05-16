"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { estAdminAuthentifie } from "@/lib/auth";
import { PRODUITS_TAG, produitTag } from "@/lib/produits-public";
import type {
  CouleurProduit,
  ImageProduit,
  Produit,
  StatutProduit,
} from "@/types/database";
import { UTApi } from "uploadthing/server";

const schemaCouleur = z.object({
  nom: z.string().min(1, "Nom requis"),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Code couleur hex invalide"),
  stock: z.coerce.number().int().min(0).default(0),
  tailles: z.array(z.string().min(1)).default([]),
});

const schemaImage = z.object({
  url: z.string().url(),
  key: z.string().min(1),
  name: z.string().optional(),
});

const schemaProduit = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().nullable().optional(),
  couleurs: z.array(schemaCouleur).default([]),
  tailles: z.array(z.string().min(1)).default([]),
  images: z.array(schemaImage).default([]),
  prix_achat: z.coerce.number().min(0),
  prix_original: z.coerce.number().min(0),
  prix_vente: z.coerce.number().min(0),
  statut: z.enum(["en stock", "en rupture"]),
  sous_type_id: z
    .string()
    .uuid()
    .nullable()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
});

export interface EtatProduit {
  erreur?: string;
  succes?: string;
  champErreurs?: Record<string, string>;
}

function exigerAdmin() {
  if (!estAdminAuthentifie()) {
    throw new Error("Non autorisé.");
  }
}

function parseJson<T>(brut: FormDataEntryValue | null, defaut: T): T {
  if (typeof brut !== "string" || !brut.trim()) return defaut;
  try {
    return JSON.parse(brut) as T;
  } catch {
    return defaut;
  }
}

function extraireDonneesForm(formData: FormData) {
  return {
    nom: String(formData.get("nom") ?? ""),
    description: (formData.get("description") as string) || null,
    couleurs: parseJson<CouleurProduit[]>(formData.get("couleurs"), []),
    tailles: parseJson<string[]>(formData.get("tailles"), []),
    images: parseJson<ImageProduit[]>(formData.get("images"), []),
    prix_achat: formData.get("prix_achat"),
    prix_original: formData.get("prix_original"),
    prix_vente: formData.get("prix_vente"),
    statut: (String(formData.get("statut") ?? "en stock") as StatutProduit),
    sous_type_id: (formData.get("sous_type_id") as string) || null,
  };
}

export async function creerProduit(
  _prev: EtatProduit,
  formData: FormData,
): Promise<EtatProduit> {
  exigerAdmin();

  const brut = extraireDonneesForm(formData);
  const result = schemaProduit.safeParse(brut);
  if (!result.success) {
    const champErreurs: Record<string, string> = {};
    for (const issue of result.error.issues) {
      champErreurs[issue.path.join(".")] = issue.message;
    }
    return { erreur: "Champs invalides.", champErreurs };
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("produits").insert({
    ...result.data,
    description: result.data.description ?? null,
  } as never);

  if (error) {
    return { erreur: `Erreur Supabase : ${error.message}` };
  }

  revalidateTag(PRODUITS_TAG);
  revalidatePath("/admin/produits");
  revalidatePath("/boutique");
  revalidatePath("/");
  return { succes: "Produit créé avec succès." };
}

export async function mettreAJourProduit(
  id: string,
  _prev: EtatProduit,
  formData: FormData,
): Promise<EtatProduit> {
  exigerAdmin();

  const brut = extraireDonneesForm(formData);
  const result = schemaProduit.safeParse(brut);
  if (!result.success) {
    const champErreurs: Record<string, string> = {};
    for (const issue of result.error.issues) {
      champErreurs[issue.path.join(".")] = issue.message;
    }
    return { erreur: "Champs invalides.", champErreurs };
  }

  const supabase = createSupabaseAdmin();

  // Récupérer images actuelles pour détecter celles à supprimer.
  const { data: existantBrut } = await supabase
    .from("produits")
    .select("images")
    .eq("id", id)
    .single();
  const existant = existantBrut as { images: ImageProduit[] } | null;

  const { error } = await supabase
    .from("produits")
    .update({
      ...result.data,
      description: result.data.description ?? null,
    } as never)
    .eq("id", id);

  if (error) {
    return { erreur: `Erreur Supabase : ${error.message}` };
  }

  // Supprimer les images retirées d'UploadThing.
  if (existant?.images) {
    const ancien = existant.images;
    const nouveau = result.data.images;
    const cles = ancien
      .filter((img) => !nouveau.some((n) => n.key === img.key))
      .map((img) => img.key)
      .filter(Boolean);
    if (cles.length > 0) {
      try {
        const utapi = new UTApi();
        await utapi.deleteFiles(cles);
      } catch (e) {
        // On ne bloque pas la sauvegarde si la suppression UploadThing échoue.
        console.error("UploadThing deleteFiles a échoué :", e);
      }
    }
  }

  revalidateTag(PRODUITS_TAG);
  revalidateTag(produitTag(id));
  revalidatePath("/admin/produits");
  revalidatePath(`/admin/produits/${id}`);
  revalidatePath("/boutique");
  revalidatePath(`/boutique/${id}`);
  revalidatePath("/");
  return { succes: "Produit mis à jour." };
}

export async function supprimerProduit(id: string): Promise<void> {
  exigerAdmin();
  const supabase = createSupabaseAdmin();

  const { data: existantBrut } = await supabase
    .from("produits")
    .select("images")
    .eq("id", id)
    .single();
  const existant = existantBrut as { images: ImageProduit[] } | null;

  const { error } = await supabase.from("produits").delete().eq("id", id);
  if (error) {
    throw new Error(`Erreur Supabase : ${error.message}`);
  }

  if (existant?.images) {
    const cles = existant.images
      .map((img) => img.key)
      .filter(Boolean);
    if (cles.length > 0) {
      try {
        const utapi = new UTApi();
        await utapi.deleteFiles(cles);
      } catch (e) {
        console.error("UploadThing deleteFiles a échoué :", e);
      }
    }
  }

  revalidateTag(PRODUITS_TAG);
  revalidateTag(produitTag(id));
  revalidatePath("/admin/produits");
  revalidatePath("/boutique");
  revalidatePath("/");
}

export async function listerProduits(): Promise<Produit[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("produits")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Produit[];
}

export async function obtenirProduit(id: string): Promise<Produit | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("produits")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as Produit | null) ?? null;
}
