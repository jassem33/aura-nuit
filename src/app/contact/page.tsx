import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact — Aura Nuit",
  description: "Contactez l'équipe Aura Nuit. Réponse sous 24 heures.",
};

function IconeMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 6l9 7 9-7" />
    </svg>
  );
}
function IconePin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function IconeHorloge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconeMagasin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9h16l-1 11H5zM4 9l2-5h12l2 5" />
    </svg>
  );
}

const COORDONNEES = [
  {
    Icone: IconePin,
    titre: "Adresse",
    texte: "Aura Nuit, Tunisie",
  },
  {
    Icone: IconeMail,
    titre: "Email",
    texte: "contact@aura-nuit.tn",
    sous: "Réponse sous 24h",
    href: "mailto:contact@aura-nuit.tn",
  },
  {
    Icone: IconeHorloge,
    titre: "Horaires",
    texte: "7j/7 de 9h à 20h",
  },
  {
    Icone: IconeMagasin,
    titre: "Magasin physique",
    texte: "Sur rendez-vous",
  },
];

export default function PageContact() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <PageHeader
        eyebrow="Service Client"
        titre="Contactez-nous"
        description="Notre équipe est à votre écoute pour répondre à toutes vos questions."
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {COORDONNEES.map((c) => {
          const Inner = (
            <>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-secondaire/30 text-secondaire mb-3">
                <c.Icone />
              </span>
              <p className="text-[9px] tracking-luxe uppercase text-secondaire mb-1">
                {c.titre}
              </p>
              <p className="text-xs md:text-sm text-charbon">{c.texte}</p>
              {c.sous && (
                <p className="text-[11px] text-charbon/55 mt-0.5">{c.sous}</p>
              )}
            </>
          );
          return c.href ? (
            <a
              key={c.titre}
              href={c.href}
              className="border border-charbon/10 bg-fond-douce p-5 hover:border-secondaire/40 transition-colors flex flex-col"
            >
              {Inner}
            </a>
          ) : (
            <div
              key={c.titre}
              className="border border-charbon/10 bg-fond-douce p-5 flex flex-col"
            >
              {Inner}
            </div>
          );
        })}
      </section>

      <section className="border border-charbon/10 bg-white p-6 md:p-8">
        <h2 className="font-display text-xl md:text-2xl text-charbon mb-1.5">
          Envoyez-nous un message
        </h2>
        <p className="text-xs text-charbon/60 mb-6">
          Tous les champs marqués d&apos;un astérisque sont obligatoires.
        </p>
        <ContactForm />
      </section>
    </div>
  );
}
