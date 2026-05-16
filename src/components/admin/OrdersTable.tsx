"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import type { Commande, StatutCommande } from "@/types/database";
import { formatDate, formatPrix } from "@/lib/utils";
import { mettreAJourStatutCommande } from "@/actions/commandes";
import { Pagination } from "./Pagination";

const STATUTS: StatutCommande[] = [
  "en attente",
  "confirmé",
  "livré",
  "retour",
];

const COULEURS_STATUT: Record<StatutCommande, string> = {
  "en attente": "bg-primaire/20 text-charbon",
  "confirmé": "bg-accent/20 text-charbon",
  "livré": "bg-green-100 text-green-800",
  "retour": "bg-secondaire/15 text-secondaire",
};

export function OrdersTable({ commandes }: { commandes: Commande[] }) {
  const [filtre, setFiltre] = useState<StatutCommande | "tous">("tous");
  const [requete, setRequete] = useState("");
  const [ouverte, setOuverte] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtrees = useMemo(() => {
    const q = requete.trim().toLowerCase();
    return commandes.filter((c) => {
      if (filtre !== "tous" && c.statut !== filtre) return false;
      if (
        q &&
        !c.nom_client.toLowerCase().includes(q) &&
        !c.id.toLowerCase().includes(q) &&
        !c.telephone_client.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [commandes, filtre, requete]);

  function changerStatut(id: string, statut: StatutCommande) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await mettreAJourStatutCommande(id, statut);
      } catch (e) {
        alert(`Erreur : ${(e as Error).message}`);
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="bg-white border border-charbon/10 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-charbon/10">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={requete}
            onChange={(e) => setRequete(e.target.value)}
            placeholder="Rechercher (client, réf., téléphone)…"
            className="px-3 py-1.5 text-xs border border-charbon/15 focus:outline-none focus:border-charbon w-72"
          />
          <div className="inline-flex border border-charbon/15 flex-wrap">
            <button
              onClick={() => setFiltre("tous")}
              className={`px-3 py-1.5 text-[11px] tracking-luxe uppercase transition-colors ${
                filtre === "tous"
                  ? "bg-charbon text-white"
                  : "text-charbon/65 hover:bg-fond-douce"
              }`}
            >
              Toutes ({commandes.length})
            </button>
            {STATUTS.map((s) => {
              const n = commandes.filter((c) => c.statut === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setFiltre(s)}
                  className={`px-3 py-1.5 text-[11px] tracking-luxe uppercase transition-colors ${
                    filtre === s
                      ? "bg-charbon text-white"
                      : "text-charbon/65 hover:bg-fond-douce"
                  }`}
                >
                  {s} ({n})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Pagination
        items={filtrees}
        pageSize={10}
        itemLabel="commandes"
        wrap={(contenu) => (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] tracking-luxe uppercase text-charbon/55 border-b border-charbon/10 bg-fond-douce/40">
                  <th className="px-4 py-2.5">Référence</th>
                  <th className="px-4 py-2.5">Client</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                  <th className="px-4 py-2.5">Statut</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>{contenu}</tbody>
            </table>
          </div>
        )}
        renderEmpty={() => (
          <div className="px-4 py-10 text-center text-charbon/50 text-sm">
            Aucune commande pour ce filtre.
          </div>
        )}
        renderRow={(c) => {
          const est_ouverte = ouverte === c.id;
          return (
            <Fragment key={c.id}>
              <tr className="border-b border-charbon/5 hover:bg-fond-douce/40">
                <td className="px-4 py-2 font-mono text-[11px] text-charbon/70">
                  #{c.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-2">
                  <p className="text-[13px]">{c.nom_client}</p>
                  <p className="text-[10px] text-charbon/50">
                    {c.telephone_client}
                  </p>
                </td>
                <td className="px-4 py-2 text-charbon/70 text-[12px]">
                  {formatDate(c.date)}
                </td>
                <td className="px-4 py-2 text-right text-[13px]">
                  {formatPrix(c.total)}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] tracking-luxe uppercase px-2 py-0.5 ${COULEURS_STATUT[c.statut]}`}
                    >
                      {c.statut}
                    </span>
                    <select
                      value={c.statut}
                      disabled={pendingId === c.id}
                      onChange={(e) =>
                        changerStatut(
                          c.id,
                          e.target.value as StatutCommande,
                        )
                      }
                      className="text-[11px] border border-charbon/15 px-1.5 py-0.5 bg-white focus:outline-none focus:border-secondaire"
                    >
                      {STATUTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => setOuverte(est_ouverte ? null : c.id)}
                    className="text-[10px] tracking-luxe uppercase text-charbon/65 hover:text-secondaire"
                  >
                    {est_ouverte ? "Réduire" : "Détails"}
                  </button>
                </td>
              </tr>
              {est_ouverte && (
                <tr className="bg-fond-douce/60">
                  <td colSpan={6} className="px-4 py-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] tracking-luxe uppercase text-charbon/50 mb-1">
                          Adresse de livraison
                        </p>
                        <p className="text-[13px] whitespace-pre-line">
                          {c.adresse_client}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-luxe uppercase text-charbon/50 mb-1">
                          Articles
                        </p>
                        <ul className="text-[13px] divide-y divide-charbon/10">
                          {c.articles.map((a, i) => (
                            <li
                              key={i}
                              className="py-1.5 flex justify-between gap-3"
                            >
                              <div>
                                <p>{a.nom}</p>
                                <p className="text-[10px] text-charbon/50">
                                  Qté : {a.quantite}
                                  {a.couleur && ` · ${a.couleur}`}
                                  {a.taille && ` · ${a.taille}`}
                                </p>
                              </div>
                              <span>
                                {formatPrix(a.prix_unitaire * a.quantite)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          );
        }}
      />
    </div>
  );
}
