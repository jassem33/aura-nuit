"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { deconnecterAdmin } from "@/actions/auth";

type Item = {
  href: string;
  label: string;
  icone: React.ReactNode;
  exact?: boolean;
};

const ITEMS: Item[] = [
  {
    href: "/admin",
    label: "Tableau de bord",
    exact: true,
    icone: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 12l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    href: "/admin/produits",
    label: "Produits",
    icone: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 12l9 4 9-4" />
        <path d="M3 17l9 4 9-4" />
      </svg>
    ),
  },
  {
    href: "/admin/categories",
    label: "Catégories",
    icone: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/admin/commandes",
    label: "Commandes",
    icone: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 2l1.5 3h9L18 2" />
        <path d="M3 7h18l-2 13H5L3 7z" />
        <path d="M9 11v4M15 11v4" />
      </svg>
    ),
  },
  {
    href: "/admin/top-ventes",
    label: "Top ventes",
    icone: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 20h18" />
        <path d="M6 20V10M12 20V4M18 20v-7" />
      </svg>
    ),
  },
];

function estActif(pathname: string, item: Item): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

function titreActif(pathname: string): string {
  for (const it of ITEMS) {
    if (estActif(pathname, it)) return it.label;
  }
  return "Administration";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/admin";
  const [ouvert, setOuvert] = useState(false);
  const titre = titreActif(pathname);

  return (
    <div className="min-h-screen bg-[#F4F1EC] text-charbon">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-60 bg-[#1B1B1E] text-white/85 flex flex-col transition-transform lg:translate-x-0 ${
          ouvert ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/10">
          <p className="font-display text-lg leading-none">
            AURA <span className="text-secondaire">NUIT</span>
          </p>
          <p className="text-[10px] tracking-luxe uppercase text-white/45 mt-1">
            Console admin
          </p>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {ITEMS.map((it) => {
            const actif = estActif(pathname, it);
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOuvert(false)}
                className={`flex items-center gap-2.5 px-3 py-2 text-[13px] rounded transition-colors ${
                  actif
                    ? "bg-secondaire/15 text-white border-l-2 border-secondaire pl-[10px]"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={actif ? "text-secondaire" : "text-white/60"}>
                  {it.icone}
                </span>
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-[12px] text-white/60 hover:text-white hover:bg-white/5 rounded"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Voir le site
          </Link>
          <form action={deconnecterAdmin}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-white/60 hover:text-secondaire hover:bg-white/5 rounded"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* Overlay mobile */}
      {ouvert && (
        <button
          aria-label="Fermer le menu"
          onClick={() => setOuvert(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* Contenu principal */}
      <div className="lg:pl-60 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white border-b border-charbon/10">
          <div className="flex items-center gap-3 px-4 lg:px-6 h-14">
            <button
              onClick={() => setOuvert(true)}
              className="lg:hidden p-1.5 text-charbon hover:bg-fond-douce rounded"
              aria-label="Ouvrir le menu"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <p className="text-[10px] tracking-luxe uppercase text-charbon/50">
                Administration
              </p>
              <p className="font-display text-base text-charbon truncate">
                {titre}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-charbon/55">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                En ligne
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
