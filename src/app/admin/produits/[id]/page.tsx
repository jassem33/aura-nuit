import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenirProduit } from "@/actions/produits";
import { ProductForm } from "@/components/admin/ProductForm";
import { listerCategoriesPublic } from "@/lib/produits-public";

export const dynamic = "force-dynamic";

export default async function PageEditerProduit({
  params,
}: {
  params: { id: string };
}) {
  const [produit, categories] = await Promise.all([
    obtenirProduit(params.id),
    listerCategoriesPublic().catch(() => []),
  ]);
  if (!produit) notFound();

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/produits"
          className="text-xs tracking-luxe uppercase text-charbon/60 hover:text-secondaire"
        >
          ← Retour aux produits
        </Link>
        <h1 className="font-display text-4xl mt-2">{produit.nom}</h1>
        <p className="text-charbon/60 text-sm mt-1">
          Modifiez les détails de cette pièce.
        </p>
      </header>

      <ProductForm produit={produit} categories={categories} />
    </div>
  );
}
