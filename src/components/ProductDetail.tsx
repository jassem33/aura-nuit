"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Produit } from "@/types/database";
import { formatPrix, pourcentageReduction, cn } from "@/lib/utils";
import { usePanier } from "./PanierContext";

export function ProductDetail({ produit }: { produit: Produit }) {
  const router = useRouter();
  const { ajouter } = usePanier();
  const [imageActive, setImageActive] = useState(0);
  const couleursDispos = useMemo(
    () => (produit.couleurs ?? []).filter((c) => Number(c.stock ?? 0) > 0),
    [produit.couleurs],
  );
  const [couleur, setCouleur] = useState<string | undefined>(
    couleursDispos[0]?.nom,
  );
  const taillesPourCouleur = useMemo(() => {
    if (couleur) {
      const c = couleursDispos.find((x) => x.nom === couleur);
      if (c && Array.isArray(c.tailles)) return c.tailles;
    }
    return produit.tailles ?? [];
  }, [couleur, couleursDispos, produit.tailles]);
  const [taille, setTaille] = useState<string | undefined>(
    taillesPourCouleur[0],
  );

  // Si la couleur change, on s'assure que la taille reste valide.
  useEffect(() => {
    if (taillesPourCouleur.length === 0) {
      setTaille(undefined);
      return;
    }
    if (!taille || !taillesPourCouleur.includes(taille)) {
      setTaille(taillesPourCouleur[0]);
    }
  }, [taillesPourCouleur, taille]);

  const [quantite, setQuantite] = useState(1);

  const enPromo =
    produit.prix_original > 0 && produit.prix_vente < produit.prix_original;
  const reduction = enPromo
    ? pourcentageReduction(produit.prix_original, produit.prix_vente)
    : 0;
  const enRupture = produit.statut === "en rupture";

  function ajouterAuPanier(passerAuCheckout: boolean) {
    if (enRupture) return;
    if (taillesPourCouleur.length > 0 && !taille) return;
    if (couleursDispos.length > 0 && !couleur) return;

    ajouter({
      produit_id: produit.id,
      nom: produit.nom,
      prix_unitaire: produit.prix_vente,
      quantite,
      couleur,
      taille,
      image: produit.images?.[0]?.url,
    });

    if (passerAuCheckout) {
      router.push("/commande");
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <div className="relative aspect-[3/4] bg-fond-douce overflow-hidden shadow-elegance">
          {produit.images[imageActive] ? (
            <Image
              src={produit.images[imageActive].url}
              alt={produit.nom}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-charbon/30 font-display">
              Aura Nuit
            </div>
          )}
          {enPromo && !enRupture && (
            <span className="absolute top-3 left-3 bg-gradient-or text-charbon px-2.5 py-0.5 text-[9px] tracking-luxe uppercase font-medium shadow-gold">
              Promotion · −{reduction}%
            </span>
          )}
        </div>

        {produit.images.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-1.5">
            {produit.images.map((img, i) => (
              <button
                key={img.key + i}
                onClick={() => setImageActive(i)}
                className={cn(
                  "relative aspect-square overflow-hidden transition-all",
                  i === imageActive
                    ? "ring-2 ring-secondaire ring-offset-2 ring-offset-fond"
                    : "opacity-70 hover:opacity-100",
                )}
                aria-label={`Image ${i + 1}`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="filet-or w-7" />
          <p className="text-[9px] tracking-luxe uppercase text-secondaire">
            Aura Nuit
          </p>
        </div>
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-charbon leading-tight">
          {produit.nom}
        </h1>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-xl md:text-2xl text-charbon">
            {formatPrix(produit.prix_vente)}
          </span>
          {enPromo && (
            <span className="text-xs text-charbon/40 line-through">
              {formatPrix(produit.prix_original)}
            </span>
          )}
        </div>

        <div className="mt-4 filet-or" />

        {produit.description && (
          <p className="mt-4 text-charbon/75 leading-relaxed whitespace-pre-line text-xs md:text-sm">
            {produit.description}
          </p>
        )}

        {couleursDispos.length > 0 && (
          <div className="mt-5">
            <p className="etiquette text-[9px] mb-1.5">
              Couleur {couleur && <span className="text-charbon">— {couleur}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {couleursDispos.map((c) => (
                <button
                  key={c.hex + c.nom}
                  onClick={() => setCouleur(c.nom)}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-all",
                    couleur === c.nom
                      ? "border-charbon scale-110"
                      : "border-charbon/15 hover:border-charbon/40",
                  )}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.nom}
                  title={c.nom}
                />
              ))}
            </div>
          </div>
        )}

        {taillesPourCouleur.length > 0 && (
          <div className="mt-5">
            <p className="etiquette text-[9px] mb-1.5">
              Taille {taille && <span className="text-charbon">— {taille}</span>}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {taillesPourCouleur.map((t) => (
                <button
                  key={t}
                  onClick={() => setTaille(t)}
                  className={cn(
                    "min-w-[2.5rem] px-3 py-1.5 text-xs border transition-all",
                    taille === t
                      ? "border-charbon bg-charbon text-white"
                      : "border-charbon/20 text-charbon hover:border-charbon",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <p className="etiquette text-[9px] mb-1.5">Quantité</p>
          <div className="inline-flex items-center border border-charbon/20">
            <button
              onClick={() => setQuantite((q) => Math.max(1, q - 1))}
              className="px-3 py-1.5 text-charbon hover:bg-fond-douce text-sm"
              aria-label="Diminuer"
            >
              −
            </button>
            <span className="px-4 py-1.5 min-w-[2.5rem] text-center text-sm">
              {quantite}
            </span>
            <button
              onClick={() => setQuantite((q) => Math.min(99, q + 1))}
              className="px-3 py-1.5 text-charbon hover:bg-fond-douce text-sm"
              aria-label="Augmenter"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => ajouterAuPanier(true)}
            disabled={enRupture}
            className="btn-or px-5 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enRupture ? "Indisponible" : "Commander maintenant"}
          </button>
          <button
            onClick={() => ajouterAuPanier(false)}
            disabled={enRupture}
            className="btn-contour px-5 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter au panier
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-charbon/10 grid grid-cols-2 gap-4 text-xs text-charbon/70">
          <div>
            <p className="text-[9px] tracking-luxe uppercase text-charbon/50 mb-0.5">
              Livraison
            </p>
            Préparation soignée sous 48 h
          </div>
          <div>
            <p className="text-[9px] tracking-luxe uppercase text-charbon/50 mb-0.5">
              Maison
            </p>
            Édition limitée Aura Nuit
          </div>
        </div>
      </div>
    </div>
  );
}
