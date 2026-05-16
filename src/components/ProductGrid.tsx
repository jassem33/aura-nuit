import type { Produit } from "@/types/database";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ produits }: { produits: Produit[] }) {
  if (produits.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-2xl text-charbon/60">
          La collection se prépare…
        </p>
        <p className="text-sm text-charbon/50 mt-2">
          Les premières pièces seront bientôt dévoilées.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {produits.map((p, i) => (
        <ProductCard key={p.id} produit={p} priorite={i < 4} />
      ))}
    </div>
  );
}
