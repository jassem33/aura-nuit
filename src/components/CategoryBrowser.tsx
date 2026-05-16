"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Produit } from "@/types/database";
import { ProductCard } from "./ProductCard";
import { formatPrix } from "@/lib/utils";

const PAR_PAGE = 10;

type TriOption = "recent" | "prix_asc" | "prix_desc" | "promo";

interface Props {
  produits: Produit[];
}

export function CategoryBrowser({ produits }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Bornes calculées à partir du dataset
  const { prixMinAbs, prixMaxAbs, taillesDispo, couleursDispo } = useMemo(() => {
    const prix = produits.map((p) => p.prix_vente).filter((n) => n > 0);
    const tSet = new Set<string>();
    const cMap = new Map<string, string>();
    for (const p of produits) {
      (p.tailles ?? []).forEach((t) => tSet.add(t));
      (p.couleurs ?? []).forEach((c) => cMap.set(c.nom, c.hex));
    }
    return {
      prixMinAbs: prix.length ? Math.floor(Math.min(...prix)) : 0,
      prixMaxAbs: prix.length ? Math.ceil(Math.max(...prix)) : 1000,
      taillesDispo: Array.from(tSet),
      couleursDispo: Array.from(cMap.entries()).map(([nom, hex]) => ({
        nom,
        hex,
      })),
    };
  }, [produits]);

  // État des filtres
  const [prixMin, setPrixMin] = useState<number>(prixMinAbs);
  const [prixMax, setPrixMax] = useState<number>(prixMaxAbs);
  const [tailles, setTailles] = useState<string[]>([]);
  const [couleurs, setCouleurs] = useState<string[]>([]);
  const [enStock, setEnStock] = useState<boolean>(false);
  const [enPromo, setEnPromo] = useState<boolean>(false);
  const [tri, setTri] = useState<TriOption>("recent");

  // Recalcul des bornes si le dataset change
  useEffect(() => {
    setPrixMin(prixMinAbs);
    setPrixMax(prixMaxAbs);
  }, [prixMinAbs, prixMaxAbs]);

  // Page courante (depuis l'URL)
  const pageURL = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  function changerPage(n: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (n <= 1) params.delete("page");
    else params.set("page", String(n));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
  }

  // Application des filtres + tri
  const filtresActifs = useMemo(() => {
    let liste = produits.filter((p) => {
      if (p.prix_vente < prixMin || p.prix_vente > prixMax) return false;
      if (tailles.length > 0 && !tailles.some((t) => p.tailles?.includes(t)))
        return false;
      if (
        couleurs.length > 0 &&
        !couleurs.some((c) => p.couleurs?.some((cc) => cc.nom === c))
      )
        return false;
      if (enStock && p.statut !== "en stock") return false;
      if (
        enPromo &&
        !(p.prix_original > 0 && p.prix_vente < p.prix_original)
      )
        return false;
      return true;
    });

    liste = [...liste].sort((a, b) => {
      if (tri === "prix_asc") return a.prix_vente - b.prix_vente;
      if (tri === "prix_desc") return b.prix_vente - a.prix_vente;
      if (tri === "promo") {
        const ra =
          a.prix_original > 0 && a.prix_vente < a.prix_original
            ? (a.prix_original - a.prix_vente) / a.prix_original
            : 0;
        const rb =
          b.prix_original > 0 && b.prix_vente < b.prix_original
            ? (b.prix_original - b.prix_vente) / b.prix_original
            : 0;
        return rb - ra;
      }
      return (b.created_at ?? "").localeCompare(a.created_at ?? "");
    });

    return liste;
  }, [produits, prixMin, prixMax, tailles, couleurs, enStock, enPromo, tri]);

  const totalPages = Math.max(1, Math.ceil(filtresActifs.length / PAR_PAGE));
  const page = Math.min(pageURL, totalPages);
  const debut = (page - 1) * PAR_PAGE;
  const fin = debut + PAR_PAGE;
  const pageProduits = filtresActifs.slice(debut, fin);

  // Retour page 1 si filtres réduisent l'ensemble
  useEffect(() => {
    if (pageURL > totalPages) {
      changerPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  function basculerTaille(t: string) {
    setTailles((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }
  function basculerCouleur(c: string) {
    setCouleurs((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }
  function reinitialiser() {
    setPrixMin(prixMinAbs);
    setPrixMax(prixMaxAbs);
    setTailles([]);
    setCouleurs([]);
    setEnStock(false);
    setEnPromo(false);
    setTri("recent");
  }

  const filtresAppliques =
    prixMin !== prixMinAbs ||
    prixMax !== prixMaxAbs ||
    tailles.length > 0 ||
    couleurs.length > 0 ||
    enStock ||
    enPromo;

  return (
    <div className="grid lg:grid-cols-[16rem_1fr] gap-8">
      {/* Sidebar filtres */}
      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="bg-white border border-charbon/10 p-5 shadow-elegance">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[10px] tracking-luxe uppercase text-charbon">
              Filtres
            </h2>
            {filtresAppliques && (
              <button
                type="button"
                onClick={reinitialiser}
                className="text-[10px] tracking-luxe uppercase text-secondaire hover:underline"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Tri */}
          <div className="mb-6">
            <p className="text-[10px] tracking-luxe uppercase text-charbon/55 mb-2">
              Trier par
            </p>
            <select
              className="champ"
              value={tri}
              onChange={(e) => setTri(e.target.value as TriOption)}
            >
              <option value="recent">Plus récents</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
              <option value="promo">Meilleures promos</option>
            </select>
          </div>

          {/* Prix */}
          <div className="mb-6">
            <p className="text-[10px] tracking-luxe uppercase text-charbon/55 mb-2">
              Prix
            </p>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                min={prixMinAbs}
                max={prixMax}
                value={prixMin}
                onChange={(e) =>
                  setPrixMin(
                    Math.min(
                      Number(e.target.value || prixMinAbs),
                      prixMax,
                    ),
                  )
                }
                className="champ h-9 text-sm"
              />
              <span className="text-charbon/40">—</span>
              <input
                type="number"
                min={prixMin}
                max={prixMaxAbs}
                value={prixMax}
                onChange={(e) =>
                  setPrixMax(
                    Math.max(
                      Number(e.target.value || prixMaxAbs),
                      prixMin,
                    ),
                  )
                }
                className="champ h-9 text-sm"
              />
            </div>
            <p className="text-[11px] text-charbon/50">
              {formatPrix(prixMin)} – {formatPrix(prixMax)}
            </p>
          </div>

          {/* Tailles */}
          {taillesDispo.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-luxe uppercase text-charbon/55 mb-2">
                Tailles
              </p>
              <div className="flex flex-wrap gap-1.5">
                {taillesDispo.map((t) => {
                  const actif = tailles.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => basculerTaille(t)}
                      className={`min-w-[2.5rem] px-2.5 py-1.5 text-xs border transition-all ${
                        actif
                          ? "bg-charbon text-white border-charbon"
                          : "border-charbon/20 text-charbon hover:border-charbon"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Couleurs */}
          {couleursDispo.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-luxe uppercase text-charbon/55 mb-2">
                Couleurs
              </p>
              <div className="flex flex-wrap gap-2">
                {couleursDispo.map((c) => {
                  const actif = couleurs.includes(c.nom);
                  return (
                    <button
                      key={c.nom}
                      type="button"
                      onClick={() => basculerCouleur(c.nom)}
                      title={c.nom}
                      className={`relative w-7 h-7 rounded-full border transition-all ${
                        actif
                          ? "ring-2 ring-secondaire ring-offset-2 border-charbon/30"
                          : "border-charbon/15 hover:border-charbon/40"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className="sr-only">{c.nom}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Disponibilité / promo */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-charbon/80">
              <input
                type="checkbox"
                checked={enStock}
                onChange={(e) => setEnStock(e.target.checked)}
                className="accent-secondaire"
              />
              En stock uniquement
            </label>
            <label className="flex items-center gap-2 text-sm text-charbon/80">
              <input
                type="checkbox"
                checked={enPromo}
                onChange={(e) => setEnPromo(e.target.checked)}
                className="accent-secondaire"
              />
              En promotion
            </label>
          </div>
        </div>
      </aside>

      {/* Liste */}
      <div>
        <div className="flex items-center justify-between mb-5 text-xs tracking-luxe uppercase text-charbon/55">
          <span>
            {filtresActifs.length} pièce
            {filtresActifs.length > 1 ? "s" : ""}
          </span>
          <span>
            Page {page} / {totalPages}
          </span>
        </div>

        {pageProduits.length === 0 ? (
          <div className="text-center py-20 bg-white border border-charbon/10">
            <p className="font-display text-xl text-charbon/60 mb-1">
              Aucune pièce ne correspond.
            </p>
            <p className="text-sm text-charbon/50">
              Essayez d&apos;ajuster vos filtres.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {pageProduits.map((p, i) => (
              <ProductCard key={p.id} produit={p} priorite={i < 4} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            page={page}
            total={totalPages}
            onChange={changerPage}
          />
        )}
      </div>
    </div>
  );
}

function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (n: number) => void;
}) {
  const pages: (number | "…")[] = [];
  const ajout = (v: number | "…") => pages.push(v);

  if (total <= 7) {
    for (let i = 1; i <= total; i++) ajout(i);
  } else {
    ajout(1);
    if (page > 3) ajout("…");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(total - 1, page + 1);
      i++
    ) {
      ajout(i);
    }
    if (page < total - 2) ajout("…");
    ajout(total);
  }

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 text-xs tracking-luxe uppercase border border-charbon/15 text-charbon hover:border-charbon disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← Préc.
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`g-${i}`}
            className="px-2 text-charbon/40 text-sm select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`min-w-[2.25rem] px-2 py-2 text-xs tracking-luxe uppercase border transition-colors ${
              p === page
                ? "bg-charbon text-white border-charbon"
                : "border-charbon/15 text-charbon hover:border-charbon"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= total}
        className="px-3 py-2 text-xs tracking-luxe uppercase border border-charbon/15 text-charbon hover:border-charbon disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Suiv. →
      </button>
    </nav>
  );
}
