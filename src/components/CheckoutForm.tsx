"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { usePanier } from "./PanierContext";
import { passerCommande, type EtatCommande } from "@/actions/commandes";
import { formatPrix } from "@/lib/utils";

export function CheckoutForm() {
  const router = useRouter();
  const {
    articles,
    total,
    nombreArticles,
    changerQuantite,
    retirer,
    vider,
    pret,
  } = usePanier();

  const [pending, startTransition] = useTransition();
  const [etat, setEtat] = useState<EtatCommande>({});

  // Redirige vers la confirmation après succès.
  useEffect(() => {
    if (etat.succes && etat.commandeId) {
      const id = etat.commandeId;
      vider();
      router.push(`/commande/confirmation?id=${id}`);
    }
  }, [etat, router, vider]);

  function soumettre(formData: FormData) {
    formData.append("articles", JSON.stringify(articles));
    startTransition(async () => {
      const resultat = await passerCommande(etat, formData);
      setEtat(resultat);
    });
  }

  if (!pret) {
    return <div className="text-center py-20 text-charbon/50">Chargement…</div>;
  }

  if (nombreArticles === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-3xl text-charbon mb-4">
          Votre panier est vide
        </p>
        <p className="text-charbon/60 mb-8">
          Découvrez nos pièces et constituez votre vestiaire.
        </p>
        <Link href="/boutique" className="btn-or">
          Visiter la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_22rem] gap-12 items-start">
      {/* Récap panier */}
      <div>
        <h2 className="font-display text-2xl text-charbon mb-6">
          Votre sélection
        </h2>
        <ul className="space-y-4">
          {articles.map((a) => (
            <li
              key={a.produit_id + (a.couleur ?? "") + (a.taille ?? "")}
              className="flex gap-4 bg-white p-4 shadow-elegance"
            >
              <div className="relative w-20 h-24 bg-fond-douce flex-shrink-0">
                {a.image && (
                  <Image
                    src={a.image}
                    alt={a.nom}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg text-charbon">{a.nom}</h3>
                  <p className="text-xs text-charbon/60 mt-1">
                    {a.couleur && <span>Couleur : {a.couleur}</span>}
                    {a.couleur && a.taille && <span> · </span>}
                    {a.taille && <span>Taille : {a.taille}</span>}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="inline-flex items-center border border-charbon/15">
                    <button
                      type="button"
                      className="px-2 py-1 hover:bg-fond-douce"
                      onClick={() =>
                        changerQuantite(
                          a.produit_id,
                          a.quantite - 1,
                          a.couleur,
                          a.taille,
                        )
                      }
                    >
                      −
                    </button>
                    <span className="px-3 text-sm">{a.quantite}</span>
                    <button
                      type="button"
                      className="px-2 py-1 hover:bg-fond-douce"
                      onClick={() =>
                        changerQuantite(
                          a.produit_id,
                          a.quantite + 1,
                          a.couleur,
                          a.taille,
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {formatPrix(a.prix_unitaire * a.quantite)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        retirer(a.produit_id, a.couleur, a.taille)
                      }
                      className="text-xs text-charbon/50 hover:text-secondaire"
                      aria-label="Retirer"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Formulaire */}
      <aside className="bg-white p-6 md:p-8 shadow-elegance lg:sticky lg:top-28">
        <h2 className="font-display text-2xl text-charbon">Vos coordonnées</h2>
        <p className="text-xs text-charbon/60 mt-1 mb-6">
          Aucun compte requis. Livraison à domicile.
        </p>

        <form
          action={soumettre}
          className="space-y-5"
          noValidate
        >
          <div>
            <label htmlFor="nom_client" className="etiquette">
              Nom complet
            </label>
            <input
              id="nom_client"
              name="nom_client"
              type="text"
              required
              autoComplete="name"
              className="champ"
              placeholder="Camille Martin"
            />
            {etat.champErreurs?.nom_client && (
              <p className="mt-1 text-xs text-secondaire">
                {etat.champErreurs.nom_client}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="adresse_client" className="etiquette">
              Adresse de livraison
            </label>
            <textarea
              id="adresse_client"
              name="adresse_client"
              required
              rows={3}
              autoComplete="street-address"
              className="champ resize-none"
              placeholder="12 rue de la Paix, 75002 Paris"
            />
            {etat.champErreurs?.adresse_client && (
              <p className="mt-1 text-xs text-secondaire">
                {etat.champErreurs.adresse_client}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="telephone_client" className="etiquette">
              Téléphone
            </label>
            <input
              id="telephone_client"
              name="telephone_client"
              type="tel"
              required
              autoComplete="tel"
              className="champ"
              placeholder="+216 22 123 456"
            />
            {etat.champErreurs?.telephone_client && (
              <p className="mt-1 text-xs text-secondaire">
                {etat.champErreurs.telephone_client}
              </p>
            )}
          </div>

          <div className="filet-or" />

          <div className="flex items-baseline justify-between">
            <span className="text-xs tracking-luxe uppercase text-charbon/60">
              Total
            </span>
            <span className="font-display text-2xl">{formatPrix(total)}</span>
          </div>

          {etat.erreur && (
            <p className="text-sm text-secondaire bg-secondaire/5 p-3 border border-secondaire/20">
              {etat.erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-or w-full disabled:opacity-50"
          >
            {pending ? "Envoi…" : "Confirmer la commande"}
          </button>

          <p className="text-[10px] text-charbon/50 leading-relaxed">
            En confirmant, vous acceptez d&apos;être contacté(e) par notre maison
            pour finaliser la livraison.
          </p>
        </form>
      </aside>
    </div>
  );
}
