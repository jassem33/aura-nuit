import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase service-role. À utiliser exclusivement côté serveur
 * pour les mutations administratives. Ne JAMAIS importer côté client.
 *
 * Note : on ne passe pas le générique Database à createClient — on caste
 * explicitement les résultats avec `as Produit` / `as Commande` dans les
 * Server Actions. Cela évite les conflits avec les contraintes strictes
 * de supabase-js v2 sur GenericTable.
 */
let cached: ReturnType<typeof createClient> | null = null;

export function createSupabaseAdmin() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Variables d'environnement manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
