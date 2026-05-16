import { notFound } from "next/navigation";
import Link from "next/link";
import {
  listerProduitsParSousTypePublic,
  obtenirSousTypeParSlugPublic,
} from "@/lib/produits-public";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { IconeCategorie } from "@/components/IconeCategorie";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { typeSlug: string; sousTypeSlug: string };
}) {
  const info = await obtenirSousTypeParSlugPublic(
    params.typeSlug,
    params.sousTypeSlug,
  );
  if (!info) {
    return { title: "Catégorie introuvable — Aura Nuit" };
  }
  return {
    title: `${info.sousType.nom} — Aura Nuit`,
    description: `Découvrez notre sélection ${info.sousType.nom.toLowerCase()} (${info.type.nom.toLowerCase()}).`,
  };
}

export default async function PageCategorie({
  params,
}: {
  params: { typeSlug: string; sousTypeSlug: string };
}) {
  const info = await obtenirSousTypeParSlugPublic(
    params.typeSlug,
    params.sousTypeSlug,
  );
  if (!info) notFound();

  const produits = await listerProduitsParSousTypePublic(info.sousType.id).catch(
    () => [],
  );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <header className="mb-8 md:mb-10">
        <nav className="text-[10px] tracking-luxe uppercase text-charbon/50 flex items-center gap-2 mb-3">
          <Link href="/" className="hover:text-secondaire">
            Accueil
          </Link>
          <span>/</span>
          <span>{info.type.nom}</span>
          <span>/</span>
          <span className="text-secondaire">{info.sousType.nom}</span>
        </nav>
        <div className="flex items-center gap-3 mb-2.5">
          <div className="filet-or w-7" />
          <p className="text-[9px] tracking-luxe uppercase text-secondaire inline-flex items-center gap-1.5">
            <IconeCategorie cle={info.type.icone} size={12} />
            {info.type.nom}
          </p>
          <div className="filet-or w-7" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-charbon leading-tight inline-flex items-center gap-3">
          <IconeCategorie cle={info.sousType.icone} size={28} />
          <span>
            {info.sousType.nom}
            <span className="text-secondaire italic">.</span>
          </span>
        </h1>
      </header>

      <CategoryBrowser produits={produits} />
    </div>
  );
}
