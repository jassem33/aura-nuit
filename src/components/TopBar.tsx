"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MESSAGES = [
  {
    icone: "✦",
    texte: "Livraison à 7 TND partout en Tunisie · Paiement à la livraison",
  },
  {
    icone: "✦",
    texte: "Édition limitée — pièces façonnées à la main",
  },
  {
    icone: "✦",
    texte: "Retours faciles sous 14 jours · Service client 7j/7",
  },
];

function IconePhone() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2L7.5 9.8a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2-.5c.9.3 1.8.5 2.7.6A2 2 0 0 1 22 16.9z" />
    </svg>
  );
}
function IconeInstagram() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function IconeFacebook() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.6c0-.9.3-1.6 1.6-1.6h1.5V4.3c-.7-.1-1.6-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5v2H7v3h2.6V21h3.9z" />
    </svg>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [estVisible, setEstVisible] = useState(true);

  // Restaurer l'état "fermé" depuis localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ferme = window.localStorage.getItem("an_topbar_ferme");
    if (ferme === "1") setEstVisible(false);
  }, []);

  // Rotation des messages.
  useEffect(() => {
    if (!estVisible) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(id);
  }, [estVisible]);

  if (pathname?.startsWith("/admin")) return null;
  if (!estVisible) return null;

  const message = MESSAGES[index];

  return (
    <div className="bg-charbon text-white text-[11px] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-8 flex items-center justify-between gap-4">
        {/* Coordonnées à gauche (desktop) */}
        <div className="hidden md:flex items-center gap-4 text-white/70">
          <a
            href="tel:+21653000666"
            className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
            aria-label="Appeler Aura Nuit"
          >
            <IconePhone />
            +216 53 000 666
          </a>
          <span className="w-px h-3 bg-white/15" />
          <Link
            href="/livraison"
            className="hover:text-accent transition-colors"
          >
            Livraison
          </Link>
        </div>

        {/* Message central rotatif */}
        <p
          key={index}
          className="flex-1 text-center text-white/85 tracking-luxe uppercase text-[10px] anim-monter truncate"
        >
          <span className="text-accent mr-2">{message.icone}</span>
          {message.texte}
          <span className="text-accent ml-2">{message.icone}</span>
        </p>

        {/* Réseaux sociaux + fermeture à droite (desktop) */}
        <div className="hidden md:flex items-center gap-3 text-white/70">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:text-accent transition-colors"
          >
            <IconeInstagram />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-accent transition-colors"
          >
            <IconeFacebook />
          </a>
          <button
            type="button"
            aria-label="Fermer la bannière"
            onClick={() => {
              setEstVisible(false);
              if (typeof window !== "undefined") {
                window.localStorage.setItem("an_topbar_ferme", "1");
              }
            }}
            className="hover:text-accent transition-colors text-[12px] leading-none"
          >
            ×
          </button>
        </div>

        {/* Bouton fermer mobile (seulement) */}
        <button
          type="button"
          aria-label="Fermer la bannière"
          onClick={() => {
            setEstVisible(false);
            if (typeof window !== "undefined") {
              window.localStorage.setItem("an_topbar_ferme", "1");
            }
          }}
          className="md:hidden text-white/60 hover:text-accent text-[14px] leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
