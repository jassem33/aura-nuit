"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Produit } from "@/types/database";
import {
  calculerProfit,
  formatPrix,
  margeBeneficiaire,
} from "@/lib/utils";
import { BoutonSupprimerProduit } from "./BoutonSupprimerProduit";
import { Pagination } from "./Pagination";

export function ProductsTable({ produits }: { produits: Produit[] }) {
  const [requete, setRequete] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<"tous" | "en stock" | "en rupture">(
    "tous",
  );

  const filtres = useMemo(() => {
    const q = requete.trim().toLowerCase();
    return produits.filter((p) => {
      if (filtreStatut !== "tous" && p.statut !== filtreStatut) return false;
      if (q && !p.nom.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [produits, requete, filtreStatut]);

  return (
    <div className="bg-white border border-charbon/10 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-charbon/10">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={requete}
            onChange={(e) => setRequete(e.target.value)}
            placeholder="Rechercher une pièce…"
            className="px-3 py-1.5 text-xs border border-charbon/15 focus:outline-none focus:border-charbon w-64"
          />
          <div className="inline-flex border border-charbon/15">
            {(["tous", "en stock", "en rupture"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFiltreStatut(s)}
                className={`px-3 py-1.5 text-[11px] tracking-luxe uppercase transition-colors ${
                  filtreStatut === s
                    ? "bg-charbon text-white"
                    : "text-charbon/65 hover:bg-fond-douce"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-charbon/55">
          {filtres.length} pièce{filtres.length > 1 ? "s" : ""}
        </p>
      </div>

      <Pagination
        items={filtres}
        pageSize={10}
        itemLabel="pièces"
        wrap={(contenu) => (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] tracking-luxe uppercase text-charbon/55 border-b border-charbon/10 bg-fond-douce/40">
                  <th className="px-4 py-2.5">Produit</th>
                  <th className="px-4 py-2.5">Statut</th>
                  <th className="px-4 py-2.5 text-right">Prix vente</th>
                  <th className="px-4 py-2.5 text-right">Prix achat</th>
                  <th className="px-4 py-2.5 text-right">Profit</th>
                  <th className="px-4 py-2.5 text-right">Marge</th>
                  <th className="px-4 py-2.5 text-right">Stock</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>{contenu}</tbody>
            </table>
          </div>
        )}
        renderEmpty={() => (
          <div className="px-4 py-10 text-center text-charbon/50 text-sm">
            Aucune pièce ne correspond.
          </div>
        )}
        renderRow={(p) => {
          const profit = calculerProfit(p.prix_achat, p.prix_vente);
          const marge = margeBeneficiaire(p.prix_achat, p.prix_vente);
          const stockTotal = (p.couleurs ?? []).reduce(
            (s, c) => s + Number(c.stock ?? 0),
            0,
          );
          return (
            <tr
              key={p.id}
              className="border-b border-charbon/5 hover:bg-fond-douce/40"
            >
              <td className="px-4 py-2">
                <Link
                  href={`/admin/produits/${p.id}`}
                  className="flex items-center gap-2.5"
                >
                  <div className="relative w-9 h-11 bg-fond-douce flex-shrink-0">
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0].url}
                        alt={p.nom}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-charbon text-[13px] truncate max-w-[220px]">
                      {p.nom}
                    </p>
                    <p className="text-[10px] text-charbon/50">
                      {p.couleurs?.length ?? 0} coul. ·{" "}
                      {p.tailles?.length ?? 0} taille(s)
                    </p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-2">
                <span
                  className={`text-[10px] tracking-luxe uppercase px-2 py-0.5 ${
                    p.statut === "en stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-secondaire/15 text-secondaire"
                  }`}
                >
                  {p.statut}
                </span>
              </td>
              <td className="px-4 py-2 text-right text-[13px]">
                {formatPrix(p.prix_vente)}
              </td>
              <td className="px-4 py-2 text-right text-charbon/60 text-[13px]">
                {formatPrix(p.prix_achat)}
              </td>
              <td
                className={`px-4 py-2 text-right text-[13px] font-medium ${profit >= 0 ? "text-green-700" : "text-secondaire"}`}
              >
                {formatPrix(profit)}
              </td>
              <td className="px-4 py-2 text-right text-charbon/70 text-[13px]">
                {marge}%
              </td>
              <td className="px-4 py-2 text-right text-[13px]">
                <span
                  className={
                    stockTotal === 0
                      ? "text-secondaire"
                      : stockTotal < 5
                        ? "text-accent"
                        : "text-charbon/70"
                  }
                >
                  {stockTotal}
                </span>
              </td>
              <td className="px-4 py-2 text-right">
                <div className="inline-flex items-center gap-2.5">
                  <Link
                    href={`/admin/produits/${p.id}`}
                    className="text-[10px] tracking-luxe uppercase text-charbon/65 hover:text-secondaire"
                  >
                    Modifier
                  </Link>
                  <BoutonSupprimerProduit id={p.id} nom={p.nom} />
                </div>
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
}
