import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { PageHeader } from "@/components/PageHeader";
import { listerProduitsPublic } from "@/lib/produits-public";

export const revalidate = 60;

export const metadata = {
  title: "Nos Ensembles — Aura Nuit",
  description: "Ensembles coordonnés Aura Nuit, conçus pour s'assortir avec grâce.",
};

const MOTS_ENSEMBLE = ["ensemble", "set", "duo", "trio", "coordonné", "parure"];

function estEnsemble(nom: string, description: string | null): boolean {
  const texte = `${nom} ${description ?? ""}`.toLowerCase();
  return MOTS_ENSEMBLE.some((m) => texte.includes(m));
}

export default async function PageEnsembles() {
  const produits = await listerProduitsPublic().catch(() => []);
  const ensembles = produits.filter((p) => estEnsemble(p.nom, p.description));
  // Repli : si aucun produit étiqueté "ensemble", on affiche les pièces avec
  // plusieurs tailles et couleurs (par définition les plus polyvalentes).
  const liste =
    ensembles.length > 0
      ? ensembles
      : produits.filter(
          (p) => (p.tailles?.length ?? 0) >= 2 && (p.couleurs?.length ?? 0) >= 2,
        );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <PageHeader
        eyebrow="Coordonnés"
        titre="Nos Ensembles"
        description="Des pièces pensées pour s'assortir, du soutien-gorge à la nuisette."
      />

      {liste.length === 0 ? (
        <div className="text-center py-14">
          <p className="font-display text-lg text-charbon/60">
            Les ensembles arrivent bientôt.
          </p>
          <Link href="/boutique" className="btn-contour px-5 py-2 text-xs mt-6 inline-flex">
            Voir la collection
          </Link>
        </div>
      ) : (
        <ProductGrid produits={liste} />
      )}
    </div>
  );
}
