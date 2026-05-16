"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { estAdminAuthentifie } from "@/lib/auth";
import {
  CATEGORIES_TAG,
  PRODUITS_TAG,
} from "@/lib/produits-public";
import { slugify } from "@/lib/utils";
import type {
  SousTypeProduit,
  TypeProduit,
} from "@/types/database";

export interface EtatCategorie {
  erreur?: string;
  succes?: string;
}

function exigerAdmin() {
  if (!estAdminAuthentifie()) {
    throw new Error("Non autorisé.");
  }
}

const schemaType = z.object({
  nom: z.string().min(1, "Nom requis"),
  ordre: z.coerce.number().int().min(0).default(0),
  icone: z
    .string()
    .max(8, "Maximum 8 caractères")
    .nullable()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
});

const schemaSousType = z.object({
  type_id: z.string().uuid("Type invalide"),
  nom: z.string().min(1, "Nom requis"),
  ordre: z.coerce.number().int().min(0).default(0),
  icone: z
    .string()
    .max(8, "Maximum 8 caractères")
    .nullable()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
});

function invalider() {
  revalidateTag(CATEGORIES_TAG);
  revalidateTag(PRODUITS_TAG);
  revalidatePath("/admin/categories", "layout");
  revalidatePath("/", "layout");
}

// ===== Types =====

export async function listerTypes(): Promise<TypeProduit[]> {
  exigerAdmin();
  const supa = createSupabaseAdmin();
  const { data, error } = await supa
    .from("types_produits")
    .select("*")
    .order("ordre", { ascending: true })
    .order("nom", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as TypeProduit[];
}

export async function listerSousTypes(): Promise<SousTypeProduit[]> {
  exigerAdmin();
  const supa = createSupabaseAdmin();
  const { data, error } = await supa
    .from("sous_types_produits")
    .select("*")
    .order("ordre", { ascending: true })
    .order("nom", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as SousTypeProduit[];
}

export async function creerType(formData: FormData): Promise<EtatCategorie> {
  exigerAdmin();
  const parsed = schemaType.safeParse({
    nom: formData.get("nom"),
    ordre: formData.get("ordre") ?? 0,
    icone: formData.get("icone"),
  });
  if (!parsed.success) {
    return { erreur: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }
  const supa = createSupabaseAdmin();
  const slug = slugify(parsed.data.nom);
  if (!slug) return { erreur: "Slug invalide." };
  const { error } = await supa.from("types_produits").insert({
    nom: parsed.data.nom,
    slug,
    ordre: parsed.data.ordre,
    icone: parsed.data.icone,
  } as never);
  if (error) return { erreur: error.message };
  invalider();
  return { succes: "Type créé." };
}

export async function mettreAJourType(
  id: string,
  formData: FormData,
): Promise<EtatCategorie> {
  exigerAdmin();
  const parsed = schemaType.safeParse({
    nom: formData.get("nom"),
    ordre: formData.get("ordre") ?? 0,
    icone: formData.get("icone"),
  });
  if (!parsed.success) {
    return { erreur: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }
  const supa = createSupabaseAdmin();
  const slug = slugify(parsed.data.nom);
  if (!slug) return { erreur: "Slug invalide." };
  const { error } = await supa
    .from("types_produits")
    .update({
      nom: parsed.data.nom,
      slug,
      ordre: parsed.data.ordre,
      icone: parsed.data.icone,
    } as never)
    .eq("id", id);
  if (error) return { erreur: error.message };
  invalider();
  return { succes: "Type mis à jour." };
}

export async function supprimerType(id: string): Promise<void> {
  exigerAdmin();
  const supa = createSupabaseAdmin();
  const { error } = await supa.from("types_produits").delete().eq("id", id);
  if (error) throw new Error(error.message);
  invalider();
}

// ===== Sous-types =====

export async function creerSousType(
  formData: FormData,
): Promise<EtatCategorie> {
  exigerAdmin();
  const parsed = schemaSousType.safeParse({
    type_id: formData.get("type_id"),
    nom: formData.get("nom"),
    ordre: formData.get("ordre") ?? 0,
    icone: formData.get("icone"),
  });
  if (!parsed.success) {
    return { erreur: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }
  const supa = createSupabaseAdmin();
  const slug = slugify(parsed.data.nom);
  if (!slug) return { erreur: "Slug invalide." };
  const { error } = await supa.from("sous_types_produits").insert({
    type_id: parsed.data.type_id,
    nom: parsed.data.nom,
    slug,
    ordre: parsed.data.ordre,
    icone: parsed.data.icone,
  } as never);
  if (error) return { erreur: error.message };
  invalider();
  return { succes: "Sous-type créé." };
}

export async function mettreAJourSousType(
  id: string,
  formData: FormData,
): Promise<EtatCategorie> {
  exigerAdmin();
  const parsed = schemaSousType.safeParse({
    type_id: formData.get("type_id"),
    nom: formData.get("nom"),
    ordre: formData.get("ordre") ?? 0,
    icone: formData.get("icone"),
  });
  if (!parsed.success) {
    return { erreur: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }
  const supa = createSupabaseAdmin();
  const slug = slugify(parsed.data.nom);
  if (!slug) return { erreur: "Slug invalide." };
  const { error } = await supa
    .from("sous_types_produits")
    .update({
      type_id: parsed.data.type_id,
      nom: parsed.data.nom,
      slug,
      ordre: parsed.data.ordre,
      icone: parsed.data.icone,
    } as never)
    .eq("id", id);
  if (error) return { erreur: error.message };
  invalider();
  return { succes: "Sous-type mis à jour." };
}

export async function supprimerSousType(id: string): Promise<void> {
  exigerAdmin();
  const supa = createSupabaseAdmin();
  const { error } = await supa
    .from("sous_types_produits")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  invalider();
}
