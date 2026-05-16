"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePanier } from "./PanierContext";
import logo from "@/images/logo.png";
import type { Produit, TypeAvecSousTypes } from "@/types/database";
import { formatPrix } from "@/lib/utils";
import { IconeCategorie } from "@/components/IconeCategorie";

function IconeAccueil() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11l9-8 9 8M5 10v10h14V10" />
    </svg>
  );
}
function IconeBoutique() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16l-1 13H5zM9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function IconePanier() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 5h2l2 12h11l2-8H7M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  );
}
function IconeRecherche() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function IconeFermer() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function IconeFleche() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function correspond(p: Produit, q: string): boolean {
  const haystack = [
    p.nom,
    p.description ?? "",
    p.statut,
    String(p.prix_vente),
    String(p.prix_original),
    ...(p.tailles ?? []),
    ...(p.couleurs ?? []).map((c) => c.nom),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function BarreRecherche({ enDrawer = false }: { enDrawer?: boolean }) {
  const router = useRouter();
  const [requete, setRequete] = useState("");
  const [produits, setProduits] = useState<Produit[] | null>(null);
  const [ouvert, setOuvert] = useState(false);
  const [focus, setFocus] = useState(false);
  const [actif, setActif] = useState(0);
  const conteneurRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/i.test(navigator.platform);

  // Charge les produits dès la première ouverture.
  useEffect(() => {
    if (!ouvert || produits !== null) return;
    let annule = false;
    fetch("/api/produits")
      .then((r) => r.json())
      .then((data) => {
        if (!annule) setProduits(data as Produit[]);
      })
      .catch(() => {
        if (!annule) setProduits([]);
      });
    return () => {
      annule = true;
    };
  }, [ouvert, produits]);

  // Clic extérieur.
  useEffect(() => {
    function surClic(e: MouseEvent) {
      if (!conteneurRef.current?.contains(e.target as Node)) {
        setOuvert(false);
      }
    }
    if (ouvert) document.addEventListener("mousedown", surClic);
    return () => document.removeEventListener("mousedown", surClic);
  }, [ouvert]);

  // Raccourci ⌘K / Ctrl+K + Echap.
  useEffect(() => {
    function surTouche(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOuvert(false);
        inputRef.current?.blur();
        return;
      }
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOuvert(true);
      }
    }
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, []);

  const resultats = useMemo(() => {
    const q = requete.trim().toLowerCase();
    if (!q || !produits) return [];
    return produits.filter((p) => correspond(p, q)).slice(0, 6);
  }, [produits, requete]);

  // Reset de l'index actif quand la requête change.
  useEffect(() => {
    setActif(0);
  }, [requete]);

  function aller(id: string) {
    setOuvert(false);
    setRequete("");
    router.push(`/boutique/${id}`);
  }

  function surFlecheClavier(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!ouvert || resultats.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActif((i) => (i + 1) % resultats.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActif((i) => (i - 1 + resultats.length) % resultats.length);
    }
  }

  function surSoumission(e: React.FormEvent) {
    e.preventDefault();
    if (resultats.length > 0) aller(resultats[actif]?.id ?? resultats[0].id);
  }

  const aRequete = requete.trim().length > 0;

  return (
    <div
      ref={conteneurRef}
      className={enDrawer ? "w-full" : "relative w-full max-w-sm"}
    >
      <form onSubmit={surSoumission} className="relative">
        <span
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors ${
            focus ? "text-secondaire" : "text-charbon/45"
          }`}
        >
          <IconeRecherche />
        </span>

        <input
          ref={inputRef}
          type="search"
          value={requete}
          onChange={(e) => setRequete(e.target.value)}
          onFocus={() => {
            setFocus(true);
            setOuvert(true);
          }}
          onBlur={() => setFocus(false)}
          onKeyDown={surFlecheClavier}
          placeholder="Rechercher une pièce, une couleur…"
          aria-label="Rechercher un produit"
          autoComplete="off"
          spellCheck={false}
          className={`w-full pl-11 ${aRequete ? "pr-10" : "pr-16"} h-10 rounded-full bg-white/80 backdrop-blur-sm border text-sm text-charbon placeholder:text-charbon/40 focus:outline-none transition-all duration-200 ease-elegance ${
            focus
              ? "border-secondaire/60 bg-white shadow-[0_8px_24px_-8px_rgba(183,110,121,0.35)]"
              : "border-charbon/15 hover:border-charbon/25 hover:bg-white"
          }`}
        />

        {aRequete ? (
          <button
            type="button"
            onClick={() => {
              setRequete("");
              inputRef.current?.focus();
            }}
            aria-label="Effacer la recherche"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-charbon/5 text-charbon/55 hover:bg-charbon/10 hover:text-charbon transition-colors"
          >
            <IconeFermer />
          </button>
        ) : (
          !enDrawer && (
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center gap-1 px-1.5 h-5 rounded border border-charbon/15 bg-fond/70 text-[10px] text-charbon/55 font-medium">
              <span>{isMac ? "⌘" : "Ctrl"}</span>
              <span>K</span>
            </kbd>
          )
        )}
      </form>

      {ouvert && aRequete && (
        <div
          className={
            (enDrawer
              ? "mt-2 bg-white border border-charbon/10 shadow-elegance rounded-2xl overflow-hidden max-h-[60vh]"
              : "absolute left-0 right-0 mt-2 bg-white border border-charbon/10 rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] overflow-hidden z-50 max-h-[70vh]") +
            " anim-apparition flex flex-col"
          }
          role="listbox"
        >
          {/* En-tête */}
          <div className="px-4 py-2.5 bg-fond-douce/60 border-b border-charbon/5 flex items-center justify-between text-[10px] tracking-luxe uppercase text-charbon/55">
            <span>
              {produits === null
                ? "Chargement…"
                : resultats.length > 0
                ? `${resultats.length} pièce${resultats.length > 1 ? "s" : ""}`
                : "Aucun résultat"}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 normal-case tracking-normal">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded border border-charbon/15 text-[9px]">↵</span>
              ouvrir
            </span>
          </div>

          {/* Contenu */}
          <div className="overflow-y-auto">
            {produits === null ? (
              <div className="px-4 py-8 space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 bg-charbon/5 rounded" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 w-2/3 bg-charbon/5 rounded" />
                      <div className="h-2 w-1/3 bg-charbon/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : resultats.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-charbon/65 mb-1">
                  Aucune pièce ne correspond.
                </p>
                <p className="text-[11px] text-charbon/45">
                  Essayez un nom, une couleur ou une taille.
                </p>
              </div>
            ) : (
              <ul>
                {resultats.map((p, i) => {
                  const img = p.images?.[0];
                  const enPromo =
                    p.prix_original > 0 && p.prix_vente < p.prix_original;
                  const estActif = i === actif;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => aller(p.id)}
                        onMouseEnter={() => setActif(i)}
                        className={`w-full flex items-center gap-3.5 px-3 py-2.5 text-left transition-colors group ${
                          estActif
                            ? "bg-fond-douce"
                            : "hover:bg-fond-douce/60"
                        }`}
                      >
                        <div className="relative shrink-0 w-12 h-14 bg-fond-douce overflow-hidden rounded">
                          {img ? (
                            <Image
                              src={img.url}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[9px] text-charbon/40 font-display">
                              AN
                            </div>
                          )}
                          {enPromo && (
                            <span className="absolute top-0.5 left-0.5 text-[8px] tracking-luxe uppercase px-1 bg-gradient-or text-charbon">
                              −
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-display text-sm text-charbon truncate leading-tight">
                            {p.nom}
                          </p>
                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] text-charbon font-medium">
                              {formatPrix(p.prix_vente)}
                            </span>
                            {enPromo && (
                              <span className="text-[10px] text-charbon/40 line-through">
                                {formatPrix(p.prix_original)}
                              </span>
                            )}
                            {p.statut === "en rupture" && (
                              <span className="text-[9px] tracking-luxe uppercase text-secondaire">
                                Rupture
                              </span>
                            )}
                            {p.couleurs?.length > 0 && (
                              <span className="inline-flex items-center gap-0.5 ml-1">
                                {p.couleurs.slice(0, 4).map((c) => (
                                  <span
                                    key={c.hex + c.nom}
                                    className="w-2 h-2 rounded-full border border-charbon/10"
                                    style={{ backgroundColor: c.hex }}
                                    title={c.nom}
                                  />
                                ))}
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`shrink-0 text-charbon/40 transition-all duration-200 ${
                            estActif
                              ? "translate-x-0 opacity-100 text-secondaire"
                              : "-translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                          }`}
                        >
                          <IconeFleche />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Pied — Voir tout */}
          {resultats.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setOuvert(false);
                setRequete("");
                router.push("/boutique");
              }}
              className="border-t border-charbon/5 bg-fond-douce/40 hover:bg-fond-douce px-4 py-2.5 text-[11px] tracking-luxe uppercase text-charbon/70 hover:text-secondaire transition-colors flex items-center justify-center gap-2"
            >
              <span>Voir toute la collection</span>
              <IconeFleche />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function IconeChevron() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function MenuType({ type }: { type: TypeAvecSousTypes }) {
  const [ouvert, setOuvert] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function ouvrir() {
    if (timer.current) clearTimeout(timer.current);
    setOuvert(true);
  }
  function fermerDifferé() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOuvert(false), 120);
  }

  const aDesSousTypes = type.sous_types.length > 0;
  const actif = ouvert && aDesSousTypes;

  return (
    <div
      className="relative h-full"
      onMouseEnter={ouvrir}
      onMouseLeave={fermerDifferé}
      onFocus={ouvrir}
      onBlur={fermerDifferé}
    >
      {/* Bouton type — bord supérieur et latéraux du bloc */}
      <button
        type="button"
        className={`relative h-full inline-flex items-center gap-2 px-4 text-xs tracking-luxe uppercase transition-colors ${
          actif
            ? "text-secondaire bg-white border-l border-r border-t border-charbon/10"
            : "text-charbon/80 hover:text-secondaire border-l border-r border-t border-transparent"
        }`}
        aria-haspopup={aDesSousTypes ? "menu" : undefined}
        aria-expanded={ouvert}
      >
        <IconeCategorie cle={type.icone} size={14} />
        {type.nom}
        {aDesSousTypes && <IconeChevron />}
        {/* Masque la bordure du bas pour faire continuité avec le panneau */}
        {actif && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 -bottom-px h-px bg-white"
          />
        )}
      </button>

      {/* Panneau des sous-types — attaché flush au bouton */}
      {actif && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 min-w-full anim-apparition"
        >
          <div className="min-w-[14rem] bg-white border border-charbon/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] rounded-b-md overflow-hidden">
            <ul className="py-1">
              {type.sous_types.map((st) => (
                <li key={st.id}>
                  <Link
                    href={`/categorie/${type.slug}/${st.slug}`}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charbon hover:bg-fond-douce hover:text-secondaire transition-colors"
                    role="menuitem"
                  >
                    <IconeCategorie cle={st.icone} size={14} />
                    <span>{st.nom}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

interface NavbarProps {
  categories?: TypeAvecSousTypes[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const { nombreArticles } = usePanier();
  const [ouvert, setOuvert] = useState(false);
  const [typeOuvertMobile, setTypeOuvertMobile] = useState<string | null>(null);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 bg-fond/85 backdrop-blur-md border-b border-charbon/10">
      {/* Niveau 1 : logo + recherche + panier */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-24 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="inline-flex items-center shrink-0"
          aria-label="Aura Nuit - Accueil"
        >
          <Image
            src={logo}
            alt="Aura Nuit"
            priority
            className="h-16 md:h-20 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:block flex-1 max-w-md mx-auto">
          <BarreRecherche />
        </div>

        <div className="hidden md:flex items-center">
          <Link
            href="/commande"
            className="inline-flex items-center gap-2 text-sm tracking-luxe uppercase text-charbon/80 hover:text-secondaire transition-colors"
          >
            <IconePanier />
            Panier
            {nombreArticles > 0 && (
              <span className="ml-1 inline-flex items-center justify-center bg-secondaire text-white text-[10px] w-5 h-5 rounded-full">
                {nombreArticles}
              </span>
            )}
          </Link>
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          aria-label="Menu"
          onClick={() => setOuvert((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-px bg-charbon transition-transform ${ouvert ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-6 h-px bg-charbon transition-opacity ${ouvert ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px bg-charbon transition-transform ${ouvert ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {/* Niveau 2 : navigation des types */}
      <div className="hidden md:block border-t border-charbon/10 bg-fond/70">
        <nav className="max-w-7xl mx-auto px-6 md:px-10 h-11 flex items-stretch justify-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 text-xs tracking-luxe uppercase text-charbon/80 hover:text-secondaire transition-colors"
          >
            <IconeAccueil />
            Accueil
          </Link>
          {categories.map((t) => (
            <MenuType key={t.id} type={t} />
          ))}
        </nav>
      </div>

      {/* Menu mobile */}
      {ouvert && (
        <div className="md:hidden border-t border-charbon/10 bg-fond">
          <div className="px-6 py-4 flex flex-col gap-4">
            <BarreRecherche enDrawer />
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-sm tracking-luxe uppercase"
              onClick={() => setOuvert(false)}
            >
              <IconeAccueil />
              Accueil
            </Link>
            {categories.map((t) => {
              const ouvertM = typeOuvertMobile === t.id;
              return (
                <div key={t.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setTypeOuvertMobile(ouvertM ? null : t.id)
                    }
                    className="w-full flex items-center justify-between text-sm tracking-luxe uppercase"
                  >
                    <span className="inline-flex items-center gap-2">
                      <IconeCategorie cle={t.icone} size={14} />
                      {t.nom}
                    </span>
                    <span
                      className={`transition-transform ${ouvertM ? "rotate-180" : ""}`}
                    >
                      <IconeChevron />
                    </span>
                  </button>
                  {ouvertM && t.sous_types.length > 0 && (
                    <ul className="mt-2 pl-3 border-l border-charbon/10 space-y-2">
                      {t.sous_types.map((st) => (
                        <li key={st.id}>
                          <Link
                            href={`/categorie/${t.slug}/${st.slug}`}
                            className="flex items-center gap-2 text-sm text-charbon/75 hover:text-secondaire"
                            onClick={() => setOuvert(false)}
                          >
                            <IconeCategorie cle={st.icone} size={14} />
                            <span>{st.nom}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            <Link
              href="/commande"
              className="inline-flex items-center gap-2.5 text-sm tracking-luxe uppercase"
              onClick={() => setOuvert(false)}
            >
              <IconePanier />
              Panier {nombreArticles > 0 && `(${nombreArticles})`}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
