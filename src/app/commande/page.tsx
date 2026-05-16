import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = {
  title: "Commande — Aura Nuit",
  description: "Finalisez votre commande Aura Nuit.",
};

export default function PageCommande() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20">
      <header className="text-center mb-12">
        <p className="text-xs tracking-luxe uppercase text-secondaire mb-3">
          Tunnel d&apos;achat
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-charbon">
          Votre commande
        </h1>
        <div className="mt-5 flex justify-center">
          <div className="filet-or w-20" />
        </div>
      </header>

      <CheckoutForm />
    </div>
  );
}
