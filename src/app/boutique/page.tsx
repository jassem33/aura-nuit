import { ProductGrid } from "@/components/ProductGrid";
import { listerProduitsPublic } from "@/lib/produits-public";

export const revalidate = 60;

export const metadata = {
  title: "Boutique — Aura Nuit",
  description: "Découvrez la collection Aura Nuit.",
};

export default async function PageBoutique() {
  const produits = await listerProduitsPublic().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <header className="mb-8 md:mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2.5">
          <div className="filet-or w-7" />
          <p className="text-[9px] tracking-luxe uppercase text-secondaire">
            Boutique
          </p>
          <div className="filet-or w-7" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-charbon leading-tight">
          La collection<span className="text-secondaire italic">.</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-charbon/65 text-xs md:text-sm leading-relaxed">
          Toutes les pièces sont façonnées en édition limitée. Chaque commande
          est préparée avec un soin particulier.
        </p>
      </header>

      <ProductGrid produits={produits} />
    </div>
  );
}
