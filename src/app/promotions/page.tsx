import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { PageHeader } from "@/components/PageHeader";
import { listerProduitsPublic } from "@/lib/produits-public";

export const revalidate = 60;

export const metadata = {
  title: "Promotions — Aura Nuit",
  description: "Les pièces Aura Nuit en promotion. Édition limitée.",
};

export default async function PagePromotions() {
  const produits = await listerProduitsPublic().catch(() => []);
  const enPromo = produits.filter(
    (p) => p.prix_original > 0 && p.prix_vente < p.prix_original,
  );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <PageHeader
        eyebrow="Édition Limitée"
        titre="Promotions"
        description="Une sélection de pièces signatures à prix réduit, le temps d'une saison."
      />

      {enPromo.length === 0 ? (
        <div className="text-center py-14">
          <p className="font-display text-lg text-charbon/60">
            Aucune promotion en cours.
          </p>
          <p className="text-xs text-charbon/55 mt-2 max-w-sm mx-auto">
            Les prochaines offres seront bientôt dévoilées — en attendant,
            découvrez la collection complète.
          </p>
          <Link href="/boutique" className="btn-contour px-5 py-2 text-xs mt-6 inline-flex">
            Voir la collection
          </Link>
        </div>
      ) : (
        <ProductGrid produits={enPromo} />
      )}
    </div>
  );
}
