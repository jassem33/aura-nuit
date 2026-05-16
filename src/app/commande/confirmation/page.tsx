import Link from "next/link";
import { obtenirCommande } from "@/actions/commandes";
import { formatPrix } from "@/lib/utils";

export const metadata = {
  title: "Commande confirmée — Aura Nuit",
};

export default async function PageConfirmation({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams.id;
  const commande = id ? await obtenirCommande(id).catch(() => null) : null;

  return (
    <div className="texture-marbre voile-mobile min-h-[70vh] flex items-center">
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-20 text-center w-full">
        <p className="text-xs tracking-luxe uppercase text-secondaire mb-4">
          Merci de votre confiance
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-charbon mb-6 leading-tight">
          Commande
          <br />
          <span className="italic">confirmée.</span>
        </h1>

        <div className="filet-or w-24 mx-auto mb-8" />

        <p className="text-charbon/75 leading-relaxed mb-8">
          Notre maison vous contactera très prochainement au numéro indiqué
          pour confirmer les détails de la livraison.
        </p>

        {commande && (
          <div className="bg-white shadow-elegance p-6 md:p-8 text-left mb-10">
            <div className="flex flex-wrap items-baseline justify-between mb-4">
              <span className="text-xs tracking-luxe uppercase text-charbon/60">
                Référence
              </span>
              <span className="font-mono text-sm text-charbon">
                #{commande.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <ul className="divide-y divide-charbon/10">
              {commande.articles.map((a, i) => (
                <li key={i} className="py-3 flex justify-between text-sm">
                  <div>
                    <p className="text-charbon">{a.nom}</p>
                    <p className="text-xs text-charbon/50">
                      Quantité : {a.quantite}
                      {a.couleur && ` · ${a.couleur}`}
                      {a.taille && ` · ${a.taille}`}
                    </p>
                  </div>
                  <span className="text-charbon">
                    {formatPrix(a.prix_unitaire * a.quantite)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="filet-or my-4" />
            <div className="flex justify-between items-baseline">
              <span className="text-xs tracking-luxe uppercase text-charbon/60">
                Total
              </span>
              <span className="font-display text-2xl">
                {formatPrix(commande.total)}
              </span>
            </div>
          </div>
        )}

        <Link href="/boutique" className="btn-contour">
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
