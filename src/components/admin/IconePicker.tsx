"use client";

import { useState } from "react";
import { ICONES_DISPONIBLES, obtenirIcone } from "@/lib/icones";

interface Props {
  valeur: string;
  onChange: (cle: string) => void;
  taille?: "sm" | "md";
}

export function IconePicker({ valeur, onChange, taille = "md" }: Props) {
  const [ouvert, setOuvert] = useState(false);
  const Actuelle = obtenirIcone(valeur);

  const dim = taille === "sm" ? "h-9 w-9" : "h-10 w-10";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        className={`${dim} inline-flex items-center justify-center border border-charbon/20 bg-white hover:border-charbon transition-colors`}
        aria-label="Choisir une icône"
        aria-expanded={ouvert}
      >
        {Actuelle ? (
          <Actuelle size={18} strokeWidth={1.6} />
        ) : (
          <span className="text-charbon/35 text-xs">—</span>
        )}
      </button>

      {ouvert && (
        <>
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setOuvert(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            className="absolute left-0 top-full mt-1.5 z-50 w-64 bg-white border border-charbon/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] rounded-md p-2 anim-apparition"
          >
            <div className="grid grid-cols-6 gap-1">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOuvert(false);
                }}
                title="Aucune"
                className={`aspect-square flex items-center justify-center text-[10px] text-charbon/50 border transition-colors ${
                  !valeur
                    ? "border-charbon bg-fond-douce"
                    : "border-transparent hover:border-charbon/20"
                }`}
              >
                ✕
              </button>
              {ICONES_DISPONIBLES.map(({ cle, label, Icone }) => {
                const actif = cle === valeur;
                return (
                  <button
                    key={cle}
                    type="button"
                    onClick={() => {
                      onChange(cle);
                      setOuvert(false);
                    }}
                    title={label}
                    className={`aspect-square flex items-center justify-center border transition-colors ${
                      actif
                        ? "border-charbon bg-fond-douce text-secondaire"
                        : "border-transparent hover:border-charbon/20"
                    }`}
                  >
                    <Icone size={16} strokeWidth={1.6} />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
