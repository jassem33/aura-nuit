import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { FaqGroup } from "@/components/FaqAccordion";

export const metadata = {
  title: "FAQ — Aura Nuit",
  description: "Réponses aux questions les plus posées par nos clientes.",
};

const GROUPES = [
  {
    titre: "Commandes",
    questions: [
      {
        question: "Comment passer une commande ?",
        reponse:
          "Ajoutez les produits souhaités à votre panier, puis cliquez sur « Commander ». Suivez les étapes pour renseigner vos informations de livraison et finaliser votre achat.",
      },
      {
        question: "Puis-je modifier ma commande après validation ?",
        reponse:
          "Contactez-nous dans l'heure qui suit la validation pour toute modification. Passé ce délai, votre colis est déjà en préparation.",
      },
      {
        question: "Comment puis-je suivre ma commande ?",
        reponse:
          "Un email de suivi vous est envoyé dès la préparation de votre colis. Vous pouvez aussi nous joindre par téléphone ou WhatsApp pour toute information.",
      },
    ],
  },
  {
    titre: "Livraison",
    questions: [
      {
        question: "Quels sont les délais de livraison ?",
        reponse: "Entre 24 et 72 h selon votre gouvernorat, à compter de la confirmation de commande.",
      },
      {
        question: "Quels sont les frais de livraison ?",
        reponse: "Forfait unique de 7 TND, livraison à domicile partout en Tunisie.",
      },
      {
        question: "Livrez-vous dans toute la Tunisie ?",
        reponse: "Oui — nous livrons l'ensemble des gouvernorats tunisiens, 7j/7.",
      },
    ],
  },
  {
    titre: "Paiement",
    questions: [
      {
        question: "Quels modes de paiement acceptez-vous ?",
        reponse: "Paiement à la livraison, en espèces uniquement.",
      },
      {
        question: "Quand est-ce que je paie ?",
        reponse: "À la livraison, après vérification du colis devant le livreur.",
      },
      {
        question: "Puis-je payer en plusieurs fois ?",
        reponse:
          "Le paiement en plusieurs fois n'est pas disponible pour le moment, mais nous travaillons à proposer cette option prochainement.",
      },
    ],
  },
  {
    titre: "Retours et Remboursements",
    questions: [
      {
        question: "Quel est le délai pour retourner un produit ?",
        reponse: "Vous disposez de 14 jours à compter de la réception pour exercer votre droit de rétractation.",
      },
      {
        question: "Comment effectuer un retour ?",
        reponse:
          "Contactez-nous par email ou téléphone, préparez le colis dans son emballage d'origine et envoyez-le à notre adresse avec le bon de retour.",
      },
      {
        question: "Sous combien de temps suis-je remboursé ?",
        reponse: "Le remboursement intégral est effectué sous 7 à 10 jours ouvrés à réception du colis.",
      },
    ],
  },
];

export default function PageFaq() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-14">
      <PageHeader
        eyebrow="Aide"
        titre="Questions Fréquentes"
        description="Trouvez rapidement les réponses à vos questions."
      />

      {GROUPES.map((g) => (
        <FaqGroup key={g.titre} titre={g.titre} questions={g.questions} />
      ))}

      <div className="text-center bg-charbon/[0.03] border border-charbon/10 p-6 mt-6">
        <h3 className="font-display text-lg text-charbon mb-1.5">
          Vous n&apos;avez pas trouvé votre réponse&nbsp;?
        </h3>
        <p className="text-xs text-charbon/65 mb-4 max-w-md mx-auto">
          Notre équipe est disponible pour répondre à toutes vos questions.
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
