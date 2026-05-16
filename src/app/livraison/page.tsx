import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "Livraison — Aura Nuit",
  description: "Modalités de livraison Aura Nuit en Tunisie.",
};

const ETAPES = [
  { titre: "Commande validée", texte: "Votre commande est confirmée et préparée" },
  { titre: "En préparation", texte: "Notre équipe prépare votre colis" },
  { titre: "Expédition", texte: "Votre colis est en route vers vous" },
  { titre: "Livraison effectuée", texte: "Votre commande est livrée avec succès" },
];

export default function PageLivraison() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <PageHeader
        eyebrow="Service Client"
        titre="Livraison"
        description="Recevez vos produits rapidement et en toute sécurité."
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div className="border border-charbon/10 bg-fond-douce p-6">
          <p className="text-[9px] tracking-luxe uppercase text-secondaire mb-2">Livraison Aura Nuit</p>
          <h2 className="font-display text-xl text-charbon mb-3">Toute la Tunisie</h2>
          <p className="text-xs text-charbon/70 mb-1">Délai : 24 à 72 h selon le gouvernorat</p>
          <p className="text-xs text-charbon/70">7 TND (forfait unique, livraison à domicile)</p>
        </div>
        <div className="border border-charbon/10 bg-fond-douce p-6">
          <p className="text-[9px] tracking-luxe uppercase text-secondaire mb-2">Sans frais</p>
          <h2 className="font-display text-xl text-charbon mb-3">Retrait sur place</h2>
          <p className="text-xs text-charbon/70 mb-1">Délai : selon disponibilité</p>
          <p className="text-xs text-charbon/70">Aucun frais de livraison</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl md:text-2xl text-charbon mb-5 text-center">
          Suivi de votre commande
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {ETAPES.map((e, i) => (
            <li key={e.titre} className="border-t border-secondaire/40 pt-3">
              <p className="text-[9px] tracking-luxe uppercase text-secondaire mb-1">
                Étape {i + 1}
              </p>
              <h3 className="font-display text-sm text-charbon mb-1.5">{e.titre}</h3>
              <p className="text-[11px] text-charbon/65 leading-relaxed">{e.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div>
          <h3 className="font-display text-base text-charbon mb-3">Modalités de paiement</h3>
          <ul className="space-y-1.5 text-xs text-charbon/70 list-disc list-inside">
            <li>Paiement à la livraison (espèces uniquement)</li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-base text-charbon mb-3">Conditions de livraison</h3>
          <ul className="space-y-1.5 text-xs text-charbon/70 list-disc list-inside">
            <li>Vérification du colis avant signature</li>
            <li>Emballage sécurisé et discret</li>
            <li>Livraison 7j/7</li>
          </ul>
        </div>
      </section>

      <div className="text-center bg-charbon/[0.03] border border-charbon/10 p-6">
        <h3 className="font-display text-lg text-charbon mb-1.5">
          Questions sur votre livraison&nbsp;?
        </h3>
        <p className="text-xs text-charbon/65 mb-4 max-w-md mx-auto">
          Notre équipe est à votre disposition pour répondre à toutes vos questions.
        </p>
        <Link href="/contact" className="btn-or px-5 py-2 text-xs inline-flex">
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
