import { notFound } from "next/navigation";
import { obtenirProduitPublic } from "@/lib/produits-public";
import { ProductDetail } from "@/components/ProductDetail";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const produit = await obtenirProduitPublic(params.id).catch(() => null);
  if (!produit) return { title: "Produit — Aura Nuit" };
  return {
    title: `${produit.nom} — Aura Nuit`,
    description: produit.description ?? "Pièce de la maison Aura Nuit.",
  };
}

export default async function PageProduit({
  params,
}: {
  params: { id: string };
}) {
  const produit = await obtenirProduitPublic(params.id).catch(() => null);
  if (!produit) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-12">
      <ProductDetail produit={produit} />
    </div>
  );
}
