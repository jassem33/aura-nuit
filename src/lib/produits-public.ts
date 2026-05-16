import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type {
  Produit,
  SousTypeProduit,
  TypeAvecSousTypes,
  TypeProduit,
} from "@/types/database";

export const PRODUITS_TAG = "produits";
export const CATEGORIES_TAG = "categories";
export const produitTag = (id: string) => `produit:${id}`;

let anonCached: ReturnType<typeof createClient> | null = null;

function supabaseAnon() {
  if (anonCached) return anonCached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Variables d'environnement manquantes : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  anonCached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return anonCached;
}

export const listerProduitsPublic = unstable_cache(
  async (): Promise<Produit[]> => {
    const { data, error } = await supabaseAnon()
      .from("produits")
      .select(
        "id, nom, description, couleurs, tailles, images, prix_original, prix_vente, statut, sous_type_id, created_at, updated_at",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as Produit[];
  },
  ["produits:list:public"],
  { tags: [PRODUITS_TAG], revalidate: 60 },
);

export const COMMANDES_TAG = "commandes";

export const listerSelectionPublic = unstable_cache(
  async (limite = 8): Promise<Produit[]> => {
    const supa = supabaseAnon();

    // 1) Tente d'agréger les ventes depuis les commandes.
    const { data: commandes } = await supa
      .from("commandes")
      .select("articles")
      .limit(500);

    const ventes = new Map<string, number>();
    for (const c of (commandes ?? []) as Array<{
      articles?: Array<{ produit_id?: string; quantite?: number }>;
    }>) {
      for (const a of c.articles ?? []) {
        if (!a?.produit_id) continue;
        ventes.set(
          a.produit_id,
          (ventes.get(a.produit_id) ?? 0) + (Number(a.quantite) || 1),
        );
      }
    }

    // 2) Récupère la liste publique (déjà partagée avec listerProduitsPublic
    //    via le tag — pas de duplication d'appel).
    const { data: produits, error } = await supa
      .from("produits")
      .select(
        "id, nom, description, couleurs, tailles, images, prix_original, prix_vente, statut, sous_type_id, created_at, updated_at",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const liste = (produits ?? []) as unknown as Produit[];

    if (ventes.size > 0) {
      // Trie : produits avec ventes en tête (par total décroissant),
      // puis le reste par récence.
      const triés = [...liste].sort((a, b) => {
        const va = ventes.get(a.id) ?? 0;
        const vb = ventes.get(b.id) ?? 0;
        if (vb !== va) return vb - va;
        return (b.created_at ?? "").localeCompare(a.created_at ?? "");
      });
      return triés.slice(0, limite);
    }

    // 3) Pas de ventes : on retombe sur les 8 plus récents.
    return liste.slice(0, limite);
  },
  ["produits:selection:public"],
  { tags: [PRODUITS_TAG, COMMANDES_TAG], revalidate: 60 },
);

export const listerCategoriesPublic = unstable_cache(
  async (): Promise<TypeAvecSousTypes[]> => {
    const supa = supabaseAnon();
    const [{ data: types, error: e1 }, { data: sousTypes, error: e2 }] =
      await Promise.all([
        supa
          .from("types_produits")
          .select("*")
          .order("ordre", { ascending: true })
          .order("nom", { ascending: true }),
        supa
          .from("sous_types_produits")
          .select("*")
          .order("ordre", { ascending: true })
          .order("nom", { ascending: true }),
      ]);
    if (e1) throw new Error(e1.message);
    if (e2) throw new Error(e2.message);

    const listeTypes = (types ?? []) as unknown as TypeProduit[];
    const listeSousTypes = (sousTypes ?? []) as unknown as SousTypeProduit[];

    return listeTypes.map((t) => ({
      ...t,
      sous_types: listeSousTypes.filter((s) => s.type_id === t.id),
    }));
  },
  ["categories:list:public"],
  { tags: [CATEGORIES_TAG], revalidate: 60 },
);

export async function obtenirSousTypeParSlugPublic(
  typeSlug: string,
  sousTypeSlug: string,
): Promise<{
  type: TypeProduit;
  sousType: SousTypeProduit;
} | null> {
  const fetcher = unstable_cache(
    async (ts: string, sts: string) => {
      const supa = supabaseAnon();
      const { data: typeData, error: e1 } = await supa
        .from("types_produits")
        .select("*")
        .eq("slug", ts)
        .maybeSingle();
      if (e1) throw new Error(e1.message);
      if (!typeData) return null;
      const type = typeData as unknown as TypeProduit;
      const { data: sousTypeData, error: e2 } = await supa
        .from("sous_types_produits")
        .select("*")
        .eq("type_id", type.id)
        .eq("slug", sts)
        .maybeSingle();
      if (e2) throw new Error(e2.message);
      if (!sousTypeData) return null;
      return {
        type,
        sousType: sousTypeData as unknown as SousTypeProduit,
      };
    },
    ["categorie:slug:public"],
    { tags: [CATEGORIES_TAG], revalidate: 60 },
  );
  return fetcher(typeSlug, sousTypeSlug);
}

export async function listerProduitsParSousTypePublic(
  sousTypeId: string,
): Promise<Produit[]> {
  const fetcher = unstable_cache(
    async (sid: string) => {
      const { data, error } = await supabaseAnon()
        .from("produits")
        .select(
          "id, nom, description, couleurs, tailles, images, prix_original, prix_vente, statut, sous_type_id, created_at, updated_at",
        )
        .eq("sous_type_id", sid)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Produit[];
    },
    ["produits:par-sous-type:public"],
    { tags: [PRODUITS_TAG, CATEGORIES_TAG], revalidate: 60 },
  );
  return fetcher(sousTypeId);
}

export async function obtenirProduitPublic(
  id: string,
): Promise<Produit | null> {
  const fetcher = unstable_cache(
    async (pid: string) => {
      const { data, error } = await supabaseAnon()
        .from("produits")
        .select("*")
        .eq("id", pid)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data as unknown as Produit | null) ?? null;
    },
    ["produits:detail:public"],
    { tags: [PRODUITS_TAG, produitTag(id)], revalidate: 60 },
  );
  return fetcher(id);
}
