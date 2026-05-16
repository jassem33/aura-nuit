import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { listerCategoriesPublic } from "@/lib/produits-public";

export const dynamic = "force-dynamic";

export default async function PageNouveauProduit() {
  const categories = await listerCategoriesPublic().catch(() => []);
  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/produits"
          className="text-xs tracking-luxe uppercase text-charbon/60 hover:text-secondaire"
        >
          ← Retour aux produits
        </Link>
        <h1 className="font-display text-4xl mt-2">Nouveau produit</h1>
        <p className="text-charbon/60 text-sm mt-1">
          Ajoutez une pièce à la collection Aura Nuit.
        </p>
      </header>

      <ProductForm categories={categories} />
    </div>
  );
}
