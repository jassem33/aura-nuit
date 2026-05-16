import Link from "next/link";
import Image from "next/image";
import heroImage from "@/images/herosection.png";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        placeholder="blur"
        quality={90}
        sizes="(min-width: 1280px) 1280px, 100vw"
        className="absolute inset-0 z-0 object-cover object-center"
      />
      {/* Voile dégradé — assure la lisibilité sans étouffer l'image */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-fond/90 via-fond/55 to-fond/5" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-fond/40 via-transparent to-transparent" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-10 py-7 md:py-10 lg:py-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-3 anim-monter">
            <div className="filet-or w-8" />
            <p className="text-[9px] tracking-luxe uppercase text-secondaire font-medium">
              Maison de Luxe · Édition Privée
            </p>
          </div>

          <h1
            className="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.05] text-charbon mb-3 anim-monter"
            style={{ animationDelay: "120ms" }}
          >
            L&apos;élégance
            <br />
            rencontre
            <br />
            <span className="italic text-secondaire">la nuit.</span>
          </h1>

          <p
            className="text-xs md:text-sm text-charbon/80 leading-relaxed mb-5 max-w-md anim-monter"
            style={{ animationDelay: "240ms" }}
          >
            Aura Nuit célèbre la femme par des pièces uniques, façonnées avec un
            soin infini. Une collection où chaque détail murmure le raffinement.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 anim-monter"
            style={{ animationDelay: "360ms" }}
          >
            <Link
              href="/boutique"
              className="btn-or px-5 py-2 text-xs"
            >
              Découvrir la collection
            </Link>
            <Link
              href="/boutique"
              className="btn-contour px-5 py-2 text-xs"
            >
              Les nouveautés
            </Link>
          </div>
        </div>

        <div
          className="mt-6 md:mt-7 grid grid-cols-3 gap-5 md:gap-10 max-w-xl anim-monter"
          style={{ animationDelay: "520ms" }}
        >
          <div className="border-t border-charbon/20 pt-2">
            <p className="font-display text-base md:text-lg text-charbon">∞</p>
            <p className="text-[9px] tracking-luxe uppercase text-charbon/65 mt-0.5">
              Savoir-faire
            </p>
          </div>
          <div className="border-t border-charbon/20 pt-2">
            <p className="font-display text-base md:text-lg text-secondaire italic">
              Or
            </p>
            <p className="text-[9px] tracking-luxe uppercase text-charbon/65 mt-0.5">
              Finitions
            </p>
          </div>
          <div className="border-t border-charbon/20 pt-2">
            <p className="font-display text-base md:text-lg text-charbon">
              Nuit
            </p>
            <p className="text-[9px] tracking-luxe uppercase text-charbon/65 mt-0.5">
              Atmosphère
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
