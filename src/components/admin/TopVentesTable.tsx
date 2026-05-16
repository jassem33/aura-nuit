"use client";

import Image from "next/image";
import Link from "next/link";
import type { Produit } from "@/types/database";
import { formatPrix } from "@/lib/utils";
import { Pagination } from "./Pagination";

export interface LigneTopVente {
  produit: Produit | null;
  produit_id: string;
  nom: string;
  image?: string;
  quantite: number;
  revenu: number;
  profit: number;
  cout: number;
  nbCommandes: number;
  dernierAchat: string | null; // ISO
}

export function TopVentesTable({
  lignes,
  totalRevenu,
  maxRevenu,
}: {
  lignes: LigneTopVente[];
  totalRevenu: number;
  maxRevenu: number;
}) {
  return (
    <Pagination
      items={lignes}
      pageSize={10}
      itemLabel="pièces"
      wrap={(contenu) => (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-fond-douce/60 text-[10px] tracking-luxe uppercase text-charbon/55">
              <tr>
                <th className="text-left px-4 py-2.5 w-10">#</th>
                <th className="text-left px-4 py-2.5">Pièce</th>
                <th className="text-right px-4 py-2.5">Quantité</th>
                <th className="text-right px-4 py-2.5">Commandes</th>
                <th className="text-right px-4 py-2.5">Revenu</th>
                <th className="text-right px-4 py-2.5">Profit</th>
                <th className="text-right px-4 py-2.5">Part</th>
                <th className="text-right px-4 py-2.5">Dernière</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charbon/5">{contenu}</tbody>
          </table>
        </div>
      )}
      renderEmpty={() => (
        <p className="text-charbon/55 text-sm py-10 text-center">
          Aucune vente enregistrée sur la période sélectionnée.
        </p>
      )}
      renderRow={(l, i) => {
        const part = totalRevenu > 0 ? (l.revenu / totalRevenu) * 100 : 0;
        const barre = maxRevenu > 0 ? (l.revenu / maxRevenu) * 100 : 0;
        const dernier = l.dernierAchat ? new Date(l.dernierAchat) : null;
        return (
          <tr
            key={l.produit_id}
            className="hover:bg-fond-douce/40 transition-colors"
          >
            <td className="px-4 py-2 align-top">
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-medium ${
                  i === 0
                    ? "bg-gradient-or text-charbon"
                    : i < 3
                      ? "bg-secondaire/15 text-secondaire"
                      : "bg-fond-douce text-charbon/60"
                }`}
              >
                {i + 1}
              </span>
            </td>
            <td className="px-4 py-2 align-top">
              <div className="flex items-center gap-2.5">
                <div className="relative shrink-0 w-9 h-11 bg-fond-douce overflow-hidden rounded">
                  {l.image ? (
                    <Image
                      src={l.image}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] text-charbon/40 font-display">
                      AN
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  {l.produit ? (
                    <Link
                      href={`/admin/produits/${l.produit.id}`}
                      className="text-[13px] text-charbon hover:text-secondaire transition-colors block truncate max-w-[240px]"
                    >
                      {l.nom}
                    </Link>
                  ) : (
                    <p className="text-[13px] text-charbon/70 truncate max-w-[240px]">
                      {l.nom}
                      <span className="ml-1 text-[10px] text-secondaire">
                        (supprimé)
                      </span>
                    </p>
                  )}
                  {l.produit && (
                    <p className="text-[10px] text-charbon/50 mt-0.5">
                      {l.produit.statut === "en rupture" ? (
                        <span className="text-secondaire">En rupture</span>
                      ) : (
                        "En stock"
                      )}
                      {" · "}
                      {formatPrix(Number(l.produit.prix_vente))}
                    </p>
                  )}
                </div>
              </div>
            </td>
            <td className="px-4 py-2 text-right tabular-nums text-charbon">
              {l.quantite}
            </td>
            <td className="px-4 py-2 text-right tabular-nums text-charbon/70">
              {l.nbCommandes}
            </td>
            <td className="px-4 py-2 text-right tabular-nums text-charbon font-medium">
              {formatPrix(l.revenu)}
            </td>
            <td className="px-4 py-2 text-right tabular-nums">
              <span
                className={l.profit >= 0 ? "text-green-700" : "text-red-600"}
              >
                {formatPrix(l.profit)}
              </span>
            </td>
            <td className="px-4 py-2 align-middle w-32">
              <div className="flex items-center gap-2 justify-end">
                <div className="relative h-1.5 bg-fond-douce rounded-full overflow-hidden w-20">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondaire to-accent rounded-full"
                    style={{ width: `${barre}%` }}
                  />
                </div>
                <span className="text-[10px] text-charbon/60 w-8 text-right">
                  {part.toFixed(0)} %
                </span>
              </div>
            </td>
            <td className="px-4 py-2 text-right text-[10px] text-charbon/55 whitespace-nowrap">
              {dernier
                ? dernier.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                  })
                : "—"}
            </td>
          </tr>
        );
      }}
    />
  );
}
