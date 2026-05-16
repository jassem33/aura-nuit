import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCarousel } from "@/components/ProductCarousel";
import { listerSelectionPublic } from "@/lib/produits-public";

export const revalidate = 60;

export default async function PageAccueil() {
  const vedette = await listerSelectionPublic(8).catch(() => []);

  return (
    <>
      <Hero />

      {/* === Promesses de la maison === */}
      <section className="bg-fond-douce border-y border-charbon/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-9">
            {[
              {
                numero: "I",
                titre: "Savoir-faire",
                texte:
                  "Chaque pièce est façonnée à la main, par des artisans qui pensent en termes d'heures et non de cadences.",
              },
              {
                numero: "II",
                titre: "Édition limitée",
                texte:
                  "Des séries volontairement restreintes. Une rareté offerte à celles qui cherchent l'unique.",
              },
              {
                numero: "III",
                titre: "Écrin signé",
                texte:
                  "Une livraison rituelle dans un écrin signé Aura Nuit, parce que le geste compte autant que la pièce.",
              },
            ].map((p) => (
              <div key={p.numero} className="flex flex-col gap-2.5">
                <p className="font-display text-xl text-secondaire italic">
                  {p.numero}
                </p>
                <div className="filet-or w-7" />
                <h3 className="font-display text-base md:text-lg text-charbon">
                  {p.titre}
                </h3>
                <p className="text-charbon/70 leading-relaxed text-xs md:text-[13px]">
                  {p.texte}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === La sélection === */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <span className="font-display text-xs text-secondaire italic">
                01
              </span>
              <div className="filet-or w-7" />
              <p className="text-[9px] tracking-luxe uppercase text-secondaire">
                Pièces signatures
              </p>
            </div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-charbon leading-tight">
              La sélection<span className="text-secondaire italic">.</span>
            </h2>
            <p className="mt-2 text-charbon/65 max-w-md text-xs md:text-sm">
              Une poignée de pièces choisies pour leur singularité — chacune
              raconte un fragment de la maison.
            </p>
          </div>
          <Link
            href="/boutique"
            className="group inline-flex items-center gap-2 text-xs tracking-luxe uppercase text-charbon hover:text-secondaire transition-colors self-start md:self-auto"
          >
            <span>Voir toute la collection</span>
            <span className="inline-block w-6 h-px bg-current transition-all duration-500 ease-elegance group-hover:w-10" />
          </Link>
        </div>

        <ProductCarousel produits={vedette} />

        {vedette.length > 0 && (
          <div className="mt-8 flex justify-center md:hidden">
            <Link href="/boutique" className="btn-contour px-5 py-2 text-xs">
              Toute la collection
            </Link>
          </div>
        )}
      </section>

      {/* === Services & engagements === */}
      <section className="bg-fond-douce border-y border-charbon/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                titre: "Livraison 7 TND",
                texte: "Partout en Tunisie",
                icone: (
                  <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                ),
              },
              {
                titre: "Matières Premium",
                texte: "Sélectionnées avec soin",
                icone: (
                  <path d="M12 3l3 5 5 1-4 4 1 5-5-3-5 3 1-5-4-4 5-1z" />
                ),
              },
              {
                titre: "Support Client",
                texte: "Email & formulaire",
                icone: (
                  <path d="M3 6h18v12H3zM3 6l9 7 9-7" />
                ),
              },
              {
                titre: "Retours 14 jours",
                texte: "Échanges faciles",
                icone: (
                  <path d="M4 10a8 8 0 0 1 14-5l2-2v6h-6l2-2a5 5 0 0 0-9 3M20 14a8 8 0 0 1-14 5l-2 2v-6h6l-2 2a5 5 0 0 0 9-3" />
                ),
              },
            ].map((s) => (
              <div
                key={s.titre}
                className="flex items-start gap-3 md:gap-4"
              >
                <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-secondaire/30 text-secondaire">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {s.icone}
                  </svg>
                </span>
                <div>
                  <p className="font-display text-sm md:text-base text-charbon leading-tight">
                    {s.titre}
                  </p>
                  <p className="text-[11px] md:text-xs text-charbon/65 mt-0.5">
                    {s.texte}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Manifeste : La maison === */}
      <section className="texture-marbre relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-3.5">
                <span className="font-display text-xs text-secondaire italic">
                  02
                </span>
                <div className="filet-or w-7" />
                <p className="text-[9px] tracking-luxe uppercase text-secondaire">
                  La maison
                </p>
              </div>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-charbon leading-[1.05]">
                Le luxe murmure,
                <br />
                <span className="italic">il ne crie jamais.</span>
              </h2>

              <div className="mt-6 flex items-center gap-3">
                <div className="filet-or w-10" />
                <p className="font-display italic text-sm text-secondaire">
                  Aura Nuit
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 lg:pl-8 lg:border-l lg:border-charbon/15">
              <p className="text-charbon/80 leading-relaxed text-sm md:text-base">
                Chaque pièce Aura Nuit est née d&apos;un geste, d&apos;une
                matière, d&apos;une lumière. Notre maison vous offre un
                vestiaire pensé pour les heures précieuses — celles où vous êtes
                pleinement vous-même.
              </p>

              <dl className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    cle: "Matière",
                    valeur: "Soies, satins et velours sélectionnés en Europe.",
                  },
                  {
                    cle: "Geste",
                    valeur:
                      "Une coupe précise, des finitions cousues main, sans hâte.",
                  },
                  {
                    cle: "Promesse",
                    valeur:
                      "Une pièce conçue pour traverser les saisons, pas l'éphémère.",
                  },
                ].map((item) => (
                  <div key={item.cle}>
                    <dt className="text-[9px] tracking-luxe uppercase text-secondaire mb-1.5">
                      {item.cle}
                    </dt>
                    <dd className="text-xs text-charbon/75 leading-relaxed">
                      {item.valeur}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* === Invitation finale === */}
      <section className="relative bg-charbon text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, #D4AF37, transparent 60%), radial-gradient(ellipse 70% 60% at 50% 100%, #B76E79, transparent 65%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 md:px-10 py-14 md:py-20 text-center">
          <p className="text-[9px] tracking-luxe uppercase text-accent mb-3.5">
            Entrez dans la maison
          </p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.05] mb-5">
            Une pièce vous attend,
            <br />
            <span className="italic text-primaire">
              celle que vous n&apos;avez pas encore choisie.
            </span>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed text-xs md:text-sm">
            Parcourez la collection complète et laissez-vous porter par les
            matières, les coupes, et les détails dorés qui signent notre
            maison.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/boutique" className="btn-or px-5 py-2 text-xs">
              Découvrir la collection
            </Link>
            <Link
              href="/commande"
              className="inline-flex items-center justify-center px-5 py-2 border border-white/30 text-white text-xs tracking-luxe uppercase hover:border-accent hover:text-accent transition-colors duration-300 ease-elegance"
            >
              Mon panier
            </Link>
          </div>

          <div className="mt-10 flex justify-center">
            <div
              className="w-16 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #D4AF37, transparent)",
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
