import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "Retours & Échanges — Aura Nuit",
  description: "Politique de retour et procédure d'échange Aura Nuit.",
};

export default function PageRetours() {
  const conditions = [
    { titre: "14 jours", texte: "Délai de rétractation à compter de la réception" },
    { titre: "Emballage intact", texte: "Produit non ouvert et dans son emballage d'origine" },
    { titre: "État neuf", texte: "Produit non utilisé et en parfait état" },
  ];
  const procedure = [
    { titre: "Contactez-nous", texte: "Informez-nous de votre souhait de retour par téléphone ou email" },
    { titre: "Préparez le colis", texte: "Emballez soigneusement le produit dans son emballage d'origine" },
    { titre: "Renvoi du produit", texte: "Expédiez le colis à notre adresse avec le bon de retour" },
    { titre: "Remboursement", texte: "Recevez votre remboursement sous 7 à 10 jours ouvrés" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <PageHeader
        eyebrow="Service Client"
        titre="Retours & Remboursements"
        description="Politique de retour simple et transparente."
      />

      <section className="mb-10">
        <h2 className="font-display text-xl md:text-2xl text-charbon mb-5 text-center">
          Conditions de retour
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {conditions.map((c) => (
            <div key={c.titre} className="border border-charbon/10 bg-fond-douce p-5">
              <h3 className="font-display text-base text-secondaire mb-1.5">{c.titre}</h3>
              <p className="text-xs text-charbon/70 leading-relaxed">{c.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl md:text-2xl text-charbon mb-5 text-center">
          Procédure de retour
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {procedure.map((p, i) => (
            <li key={p.titre} className="relative pl-10">
              <span className="absolute left-0 top-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondaire/15 text-secondaire font-display text-sm">
                {i + 1}
              </span>
              <h3 className="font-display text-sm text-charbon mb-1.5">{p.titre}</h3>
              <p className="text-[11px] text-charbon/65 leading-relaxed">{p.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div>
          <h3 className="font-display text-base text-charbon mb-3">Produits non retournables</h3>
          <ul className="space-y-1.5 text-xs text-charbon/70 list-disc list-inside">
            <li>Produits d&apos;hygiène personnelle</li>
            <li>Produits cosmétiques descellés</li>
            <li>Articles personnalisés ou sur-mesure</li>
          </ul>
          <p className="mt-3 text-[11px] text-charbon/55">
            Pour des raisons d&apos;hygiène et de sécurité, certains produits ne
            peuvent être retournés une fois ouverts ou utilisés.
          </p>
        </div>
        <div className="grid gap-5">
          <div>
            <h3 className="font-display text-base text-charbon mb-3">Remboursement</h3>
            <ul className="space-y-1.5 text-xs text-charbon/70 list-disc list-inside">
              <li>Remboursement intégral sous 7 à 10 jours ouvrés</li>
              <li>Même moyen de paiement que la commande</li>
              <li>Notification par email à réception du colis</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-base text-charbon mb-3">Échange</h3>
            <ul className="space-y-1.5 text-xs text-charbon/70 list-disc list-inside">
              <li>Possibilité d&apos;échange selon disponibilité</li>
              <li>Même procédure que le retour</li>
              <li>Pas de frais supplémentaires</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="text-center bg-charbon/[0.03] border border-charbon/10 p-6">
        <h3 className="font-display text-lg text-charbon mb-1.5">
          Besoin d&apos;aide pour un retour&nbsp;?
        </h3>
        <p className="text-xs text-charbon/65 mb-4 max-w-md mx-auto">
          Notre service client est là pour vous accompagner dans votre démarche.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <Link href="/contact" className="btn-or px-5 py-2 text-xs inline-flex justify-center">
            Nous contacter
          </Link>
          <a href="tel:+21653000666" className="btn-contour px-5 py-2 text-xs inline-flex justify-center">
            +216 53 000 666
          </a>
        </div>
      </div>
    </div>
  );
}
