"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/images/logo.png";

function IconeFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.6c0-.9.3-1.6 1.6-1.6h1.5V4.3c-.7-.1-1.6-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5v2H7v3h2.6V21h3.9z" />
    </svg>
  );
}

function IconeInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconeWhatsapp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.5 3.5A10 10 0 0 0 3.7 16.6L2 22l5.6-1.6A10 10 0 1 0 20.5 3.5zm-8.5 17a8 8 0 0 1-4.1-1.1l-.3-.2-3.3 1 1-3.3-.2-.3A8 8 0 1 1 12 20.5zm4.6-6c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1c-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-1.7-.9-2.8-1.6-3.9-3.5-.3-.5.3-.5.8-1.5.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2.1 3.1 5 4.4.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.4.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3z" />
    </svg>
  );
}

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-20 border-t border-charbon/10 bg-fond-douce">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <Image
            src={logo}
            alt="Aura Nuit"
            className="h-20 md:h-24 w-auto object-contain mb-5"
          />
          <p className="text-xs md:text-sm text-charbon/70 max-w-xs leading-relaxed">
            Lingerie fine, maillots de bain et mode féminine en Tunisie.
            Livraison à domicile 7 TND partout sur le territoire.
          </p>

          <div className="mt-5 flex items-center gap-2.5">
            {[
              { href: "https://facebook.com", label: "Facebook", Icone: IconeFacebook },
              { href: "https://instagram.com", label: "Instagram", Icone: IconeInstagram },
              { href: "https://wa.me/21653000666", label: "WhatsApp", Icone: IconeWhatsapp },
            ].map(({ href, label, Icone }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-charbon/15 text-charbon/70 hover:text-secondaire hover:border-secondaire transition-colors"
              >
                <Icone />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-base md:text-lg text-charbon mb-4">
            Collections
          </h4>
          <ul className="space-y-2 text-xs md:text-sm">
            <li><Link href="/boutique" className="hover:text-secondaire transition-colors">Toute la Collection</Link></li>
            <li><Link href="/ensembles" className="hover:text-secondaire transition-colors">Nos Ensembles</Link></li>
            <li><Link href="/promotions" className="hover:text-secondaire transition-colors">Promotions</Link></li>
            <li><Link href="/guide-tailles" className="hover:text-secondaire transition-colors">Guide des Tailles</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base md:text-lg text-charbon mb-4">
            Service Client
          </h4>
          <ul className="space-y-2 text-xs md:text-sm">
            <li><Link href="/contact" className="hover:text-secondaire transition-colors">Nous Contacter</Link></li>
            <li><Link href="/livraison" className="hover:text-secondaire transition-colors">Livraison</Link></li>
            <li><Link href="/retours" className="hover:text-secondaire transition-colors">Retours & Échanges</Link></li>
            <li><Link href="/faq" className="hover:text-secondaire transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base md:text-lg text-charbon mb-4">
            Contact
          </h4>
          <ul className="space-y-2 text-xs md:text-sm text-charbon/70 leading-relaxed">
            <li>
              <a href="mailto:contact@aura-nuit.tn" className="hover:text-secondaire transition-colors">
                contact@aura-nuit.tn
              </a>
            </li>
            <li>
              <a href="tel:+21653000666" className="hover:text-secondaire transition-colors">
                +216 53 000 666
              </a>
            </li>
            <li className="text-charbon/65">Aura Nuit — livraison sur toute la Tunisie</li>
            <li className="text-charbon/65">7j/7 · réponse sous 24h</li>
          </ul>
        </div>
      </div>

      <div className="filet-or" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-charbon/50">
        <p>© {new Date().getFullYear()} Aura Nuit — Lingerie & Mode Féminine. Tous droits réservés.</p>
        <p className="tracking-luxe uppercase">L&apos;élégance rencontre la nuit</p>
      </div>
    </footer>
  );
}
