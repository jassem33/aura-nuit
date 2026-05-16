import Link from "next/link";
import { listerProduits } from "@/actions/produits";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function PageAdminProduits() {
  const produits = await listerProduits();

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charbon">Produits</h1>
          <p className="text-charbon/55 text-xs mt-0.5">
            {produits.length} pièce{produits.length > 1 ? "s" : ""} dans la collection.
          </p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="bg-charbon text-white px-4 py-2 text-[11px] tracking-luxe uppercase hover:bg-secondaire transition-colors"
        >
          + Nouveau produit
        </Link>
      </header>

      <ProductsTable produits={produits} />
    </div>
  );
}
