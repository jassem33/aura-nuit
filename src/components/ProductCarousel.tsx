"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Produit } from "@/types/database";
import { ProductCard } from "./ProductCard";

function IconeChevronGauche() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function IconeChevronDroite() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ProductCarousel({ produits }: { produits: Produit[] }) {
  const pisteRef = useRef<HTMLDivElement>(null);
  const [peutGauche, setPeutGauche] = useState(false);
  const [peutDroite, setPeutDroite] = useState(false);
  const [pageActive, setPageActive] = useState(0);
  const [nbPages, setNbPages] = useState(1);

  const majEtat = useCallback(() => {
    const el = pisteRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPeutGauche(el.scrollLeft > 2);
    setPeutDroite(el.scrollLeft < max - 2);
    // Calcul dynamique du nombre de pages à partir des dimensions réelles
    const largeurPage = el.clientWidth;
    if (largeurPage > 0) {
      const totalPages = Math.max(1, Math.ceil(max / largeurPage) + 1);
      setNbPages(totalPages);
      const idx = Math.round(el.scrollLeft / largeurPage);
      setPageActive(Math.min(totalPages - 1, Math.max(0, idx)));
    }
  }, []);

  useEffect(() => {
    const el = pisteRef.current;
    if (!el) return;
    majEtat();
    el.addEventListener("scroll", majEtat, { passive: true });
    window.addEventListener("resize", majEtat);
    return () => {
      el.removeEventListener("scroll", majEtat);
      window.removeEventListener("resize", majEtat);
    };
  }, [majEtat]);

  const decaler = (direction: 1 | -1) => {
    const el = pisteRef.current;
    if (!el) return;
    // Une page = exactement la largeur visible (= 4 cartes).
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  };

  const allerA = (page: number) => {
    const el = pisteRef.current;
    if (!el) return;
    el.scrollTo({ left: page * el.clientWidth, behavior: "smooth" });
  };

  if (produits.length === 0) {
    return (
      <div className="text-center py-14">
        <p className="font-display text-lg text-charbon/60">
          La collection se prépare…
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Boutons de navigation desktop */}
      <button
        type="button"
        onClick={() => decaler(-1)}
        disabled={!peutGauche}
        aria-label="Précédent"
        className={`flex absolute -left-1 md:-left-4 lg:-left-6 top-[38%] -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-full bg-white border border-charbon/15 text-charbon shadow-elegance transition-all duration-300 ease-elegance ${
          peutGauche
            ? "opacity-100 hover:bg-charbon hover:text-white hover:border-charbon hover:scale-105"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <IconeChevronGauche />
      </button>
      <button
        type="button"
        onClick={() => decaler(1)}
        disabled={!peutDroite}
        aria-label="Suivant"
        className={`flex absolute -right-1 md:-right-4 lg:-right-6 top-[38%] -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-full bg-white border border-charbon/15 text-charbon shadow-elegance transition-all duration-300 ease-elegance ${
          peutDroite
            ? "opacity-100 hover:bg-charbon hover:text-white hover:border-charbon hover:scale-105"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <IconeChevronDroite />
      </button>

      {/* Voiles latéraux pour adoucir les bords */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-10 z-[1] bg-gradient-to-r from-fond to-transparent transition-opacity duration-300 ${
          peutGauche ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 w-10 z-[1] bg-gradient-to-l from-fond to-transparent transition-opacity duration-300 ${
          peutDroite ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Piste de défilement — 4 cartes par page exactement */}
      <div
        ref={pisteRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Sélection de produits"
      >
        {produits.map((p, i) => (
          <div
            key={p.id}
            className="snap-start shrink-0 basis-[calc((100%-0.75rem)/2)] md:basis-[calc((100%-(3*1rem))/4)]"
          >
            <ProductCard produit={p} priorite={i < 4} />
          </div>
        ))}
      </div>

      {/* Pagination — une puce par page de 4 */}
      {nbPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {Array.from({ length: nbPages }).map((_, i) => {
            const actif = i === pageActive;
            return (
              <button
                key={i}
                type="button"
                onClick={() => allerA(i)}
                aria-label={`Aller à la page ${i + 1}`}
                aria-current={actif}
                className={`h-1 rounded-full transition-all duration-300 ease-elegance ${
                  actif ? "w-8 bg-secondaire" : "w-2 bg-charbon/20 hover:bg-charbon/40"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
