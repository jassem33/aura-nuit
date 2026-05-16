import Image from "next/image";
import Link from "next/link";
import type { Produit } from "@/types/database";
import { formatPrix, pourcentageReduction } from "@/lib/utils";

export function ProductCard({
  produit,
  priorite = false,
}: {
  produit: Produit;
  priorite?: boolean;
}) {
  const enPromo =
    produit.prix_original > 0 && produit.prix_vente < produit.prix_original;
  const reduction = enPromo
    ? pourcentageReduction(produit.prix_original, produit.prix_vente)
    : 0;
  const enRupture = produit.statut === "en rupture";
  const imageCouverture = produit.images?.[0];
  const couleursDispos = (produit.couleurs ?? []).filter(
    (c) => Number(c.stock ?? 0) > 0,
  );

  return (
    <Link
      href={`/boutique/${produit.id}`}
      className="group block carte relative overflow-hidden"
    >
      <div className="relative aspect-[3/4] bg-fond-douce overflow-hidden">
        {imageCouverture ? (
          <Image
            src={imageCouverture.url}
            alt={produit.nom}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-elegance group-hover:scale-[1.03]"
            priority={priorite}
            loading={priorite ? "eager" : "lazy"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-charbon/30 font-display text-xl">
            Aura Nuit
          </div>
        )}

        {enPromo && !enRupture && (
          <span className="absolute top-2 left-2 bg-gradient-or text-charbon px-2 py-0.5 text-[9px] tracking-luxe uppercase font-medium shadow-gold">
            −{reduction}%
          </span>
        )}

        {enRupture && (
          <span className="absolute top-2 right-2 bg-charbon text-white px-2.5 py-0.5 text-[9px] tracking-luxe uppercase shadow-elegance">
            En rupture
          </span>
        )}
      </div>

      <div className="p-3 md:p-4">
        <h3 className="font-display text-sm md:text-base text-charbon group-hover:text-secondaire transition-colors line-clamp-1">
          {produit.nom}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-charbon font-medium text-sm">
            {formatPrix(produit.prix_vente)}
          </span>
          {enPromo && (
            <span className="text-charbon/40 text-xs line-through">
              {formatPrix(produit.prix_original)}
            </span>
          )}
        </div>

        {couleursDispos.length > 0 && (
          <div className="mt-2 flex items-center gap-1">
            {couleursDispos.slice(0, 5).map((c) => (
              <span
                key={c.hex + c.nom}
                title={c.nom}
                className="w-2.5 h-2.5 rounded-full border border-charbon/10"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {couleursDispos.length > 5 && (
              <span className="text-[9px] text-charbon/50 ml-0.5">
                +{couleursDispos.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
