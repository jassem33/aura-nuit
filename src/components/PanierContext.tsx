"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ArticleCommande } from "@/types/database";

interface PanierContextValeur {
  articles: ArticleCommande[];
  ajouter: (article: ArticleCommande) => void;
  retirer: (produit_id: string, couleur?: string, taille?: string) => void;
  changerQuantite: (
    produit_id: string,
    quantite: number,
    couleur?: string,
    taille?: string,
  ) => void;
  vider: () => void;
  total: number;
  nombreArticles: number;
  pret: boolean;
}

const PanierContext = createContext<PanierContextValeur | null>(null);

const CLE_STORAGE = "aura-nuit-panier";

function memeLigne(
  a: ArticleCommande,
  b: { produit_id: string; couleur?: string; taille?: string },
): boolean {
  return (
    a.produit_id === b.produit_id &&
    (a.couleur ?? "") === (b.couleur ?? "") &&
    (a.taille ?? "") === (b.taille ?? "")
  );
}

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<ArticleCommande[]>([]);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    try {
      const brut = localStorage.getItem(CLE_STORAGE);
      if (brut) setArticles(JSON.parse(brut));
    } catch {
      // ignore
    }
    setPret(true);
  }, []);

  useEffect(() => {
    if (!pret) return;
    try {
      localStorage.setItem(CLE_STORAGE, JSON.stringify(articles));
    } catch {
      // ignore
    }
  }, [articles, pret]);

  const ajouter = useCallback((article: ArticleCommande) => {
    setArticles((prec) => {
      const idx = prec.findIndex((a) => memeLigne(a, article));
      if (idx >= 0) {
        const copie = [...prec];
        copie[idx] = {
          ...copie[idx],
          quantite: Math.min(99, copie[idx].quantite + article.quantite),
        };
        return copie;
      }
      return [...prec, article];
    });
  }, []);

  const retirer = useCallback(
    (produit_id: string, couleur?: string, taille?: string) => {
      setArticles((prec) =>
        prec.filter((a) => !memeLigne(a, { produit_id, couleur, taille })),
      );
    },
    [],
  );

  const changerQuantite = useCallback(
    (
      produit_id: string,
      quantite: number,
      couleur?: string,
      taille?: string,
    ) => {
      setArticles((prec) =>
        prec
          .map((a) =>
            memeLigne(a, { produit_id, couleur, taille })
              ? { ...a, quantite: Math.max(0, Math.min(99, quantite)) }
              : a,
          )
          .filter((a) => a.quantite > 0),
      );
    },
    [],
  );

  const vider = useCallback(() => setArticles([]), []);

  const total = useMemo(
    () =>
      Math.round(
        articles.reduce((acc, a) => acc + a.prix_unitaire * a.quantite, 0) *
          100,
      ) / 100,
    [articles],
  );

  const nombreArticles = useMemo(
    () => articles.reduce((acc, a) => acc + a.quantite, 0),
    [articles],
  );

  const valeur = useMemo<PanierContextValeur>(
    () => ({
      articles,
      ajouter,
      retirer,
      changerQuantite,
      vider,
      total,
      nombreArticles,
      pret,
    }),
    [
      articles,
      ajouter,
      retirer,
      changerQuantite,
      vider,
      total,
      nombreArticles,
      pret,
    ],
  );

  return (
    <PanierContext.Provider value={valeur}>{children}</PanierContext.Provider>
  );
}

export function usePanier() {
  const ctx = useContext(PanierContext);
  if (!ctx) throw new Error("usePanier doit être utilisé dans PanierProvider.");
  return ctx;
}
