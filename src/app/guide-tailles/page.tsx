import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { FaqGroup } from "@/components/FaqAccordion";

export const metadata = {
  title: "Guide des Tailles — Aura Nuit",
  description: "Conseils et guides pour entretenir et choisir votre lingerie.",
};

const CONSEILS = [
  {
    titre: "Lavage délicat",
    texte: "Lavez votre lingerie à 30°C en cycle délicat ou à la main pour préserver l'élasticité et la forme.",
  },
  {
    titre: "Séchage à plat",
    texte: "Évitez le sèche-linge, faites sécher votre lingerie à plat pour conserver sa forme originale.",
  },
  {
    titre: "Mesurez-vous régulièrement",
    texte: "Votre morphologie évolue : remesurez votre tour de poitrine tous les 6 mois pour toujours avoir la bonne taille.",
  },
  {
    titre: "Guide des matières",
    texte: "La dentelle pour la séduction, le coton pour le quotidien, la microfibre pour le sport et le confort.",
  },
];

const ARTICLES = [
  {
    categorie: "Guide des Tailles",
    duree: "5 min",
    titre: "Comment choisir la bonne taille de soutien-gorge",
    extrait: "Un guide complet pour trouver votre taille parfaite et profiter d'un confort optimal tout au long de la journée.",
  },
  {
    categorie: "Tendances",
    duree: "4 min",
    titre: "Les tendances lingerie de la saison",
    extrait: "Découvrez les nouvelles collections et les styles incontournables de la saison pour sublimer votre silhouette.",
  },
  {
    categorie: "Entretien",
    duree: "6 min",
    titre: "Comment prendre soin de votre lingerie",
    extrait: "Les gestes essentiels pour prolonger la durée de vie de vos pièces préférées : lavage, séchage et rangement.",
  },
  {
    categorie: "Maillots de Bain",
    duree: "7 min",
    titre: "Bien choisir son maillot de bain",
    extrait: "Tous les conseils pour trouver le maillot qui met en valeur votre silhouette et adapté à vos activités.",
  },
  {
    categorie: "Nuit",
    duree: "5 min",
    titre: "La lingerie de nuit : confort et séduction",
    extrait: "Entre nuisettes, pyjamas et déshabillés, découvrez comment allier confort et élégance pour vos nuits.",
  },
  {
    categorie: "Style",
    duree: "4 min",
    titre: "Quelles couleurs de lingerie pour chaque tenue ?",
    extrait: "Le guide pour ne plus avoir de lingerie visible sous vos vêtements et choisir les bonnes teintes selon vos tenues.",
  },
];

const QUESTIONS = [
  {
    question: "Comment trouver ma taille de soutien-gorge ?",
    reponse: "Mesurez votre tour de buste (sous la poitrine) et votre tour de poitrine (au plus fort). Reportez ces deux mesures sur notre table de correspondance pour obtenir votre taille en bonnet et tour.",
  },
  {
    question: "Comment entretenir ma lingerie en dentelle ?",
    reponse: "Lavage à la main en eau tiède avec une lessive douce, séchage à plat à l'abri du soleil. Ne jamais essorer ni utiliser de sèche-linge.",
  },
  {
    question: "Quelle lingerie porter sous une robe blanche ?",
    reponse: "Privilégiez une lingerie nude ou chair, plus discrète que le blanc sous une étoffe claire. La dentelle fine est aussi une option élégante.",
  },
  {
    question: "Comment choisir mon maillot de bain selon ma morphologie ?",
    reponse: "Silhouette en A : haut volumineux, bas simple. En V : bas structuré, haut épuré. En H : maillot une pièce avec découpes. En 8 : valorisez la taille avec une pièce ceinturée.",
  },
  {
    question: "Combien de temps dure une lingerie de qualité ?",
    reponse: "Une pièce bien entretenue se porte entre 1 et 3 ans selon la fréquence d'utilisation. Alternez vos pièces et respectez les conseils de lavage pour prolonger leur durée de vie.",
  },
  {
    question: "Quelles matières pour une lingerie au quotidien ?",
    reponse: "Le coton et la microfibre restent les plus confortables au quotidien : respirants, doux, faciles d'entretien.",
  },
];

export default function PageGuideTailles() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <PageHeader
        eyebrow="Style & Tendances"
        titre="Guide Style & Lingerie"
        description="Découvrez nos conseils pratiques et guides pour prendre soin de votre mode et élégance au quotidien."
      />

      {/* Conseils essentiels */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONSEILS.map((c) => (
            <div key={c.titre} className="border border-charbon/10 bg-fond-douce p-5">
              <div className="filet-or w-7 mb-3" />
              <h3 className="font-display text-sm md:text-base text-charbon mb-2">
                {c.titre}
              </h3>
              <p className="text-[12px] text-charbon/65 leading-relaxed">{c.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles & Guides */}
      <section className="mb-12">
        <h2 className="font-display text-xl md:text-2xl text-charbon mb-5 text-center">
          Articles &amp; Guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ARTICLES.map((a) => (
            <article key={a.titre} className="border border-charbon/10 bg-white p-5 hover:shadow-elegance transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] tracking-luxe uppercase text-secondaire">
                  {a.categorie}
                </span>
                <span className="text-[10px] text-charbon/50">{a.duree} de lecture</span>
              </div>
              <h3 className="font-display text-sm md:text-base text-charbon mb-2 leading-snug">
                {a.titre}
              </h3>
              <p className="text-[12px] text-charbon/65 leading-relaxed mb-3 line-clamp-3">
                {a.extrait}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] tracking-luxe uppercase text-charbon/70 group cursor-default">
                Lire l&apos;article
                <span className="inline-block w-4 h-px bg-current" />
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* Questions Fréquentes */}
      <FaqGroup titre="Questions Fréquentes" questions={QUESTIONS} />

      <div className="text-center bg-charbon/[0.03] border border-charbon/10 p-6 mt-6">
        <h3 className="font-display text-lg text-charbon mb-1.5">
          Besoin d&apos;un conseil personnalisé&nbsp;?
        </h3>
        <p className="text-xs text-charbon/65 mb-4 max-w-md mx-auto">
          Notre équipe est disponible pour répondre à toutes vos questions et
          vous orienter vers les solutions adaptées.
        </p>
        <Link href="/contact" className="btn-or px-5 py-2 text-xs inline-flex">
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
