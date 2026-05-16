import Image from "next/image";
import Link from "next/link";
import { listerProduits } from "@/actions/produits";
import { listerCommandes } from "@/actions/commandes";
import { formatPrix } from "@/lib/utils";
import type { Commande, Produit } from "@/types/database";
import {
  TopVentesTable,
  type LigneTopVente,
} from "@/components/admin/TopVentesTable";

export const dynamic = "force-dynamic";

const PERIODES = [
  { cle: "7", label: "7 j" },
  { cle: "30", label: "30 j" },
  { cle: "90", label: "90 j" },
  { cle: "tout", label: "Tout" },
] as const;

type PeriodeCle = (typeof PERIODES)[number]["cle"];

const MS_JOUR = 24 * 60 * 60 * 1000;

function filtrerParPeriode(
  commandes: Commande[],
  cle: PeriodeCle,
): Commande[] {
  if (cle === "tout") return commandes;
  const jours = Number(cle);
  if (!Number.isFinite(jours)) return commandes;
  const seuil = new Date(Date.now() - jours * MS_JOUR);
  return commandes.filter((c) => new Date(c.date) >= seuil);
}

export default async function PageTopVentes({
  searchParams,
}: {
  searchParams: { periode?: string; tri?: string };
}) {
  const cle = (PERIODES.find((p) => p.cle === searchParams.periode)?.cle ??
    "30") as PeriodeCle;
  const tri = (searchParams.tri ?? "revenu") as
    | "revenu"
    | "quantite"
    | "profit"
    | "commandes";

  const [produits, commandes] = await Promise.all([
    listerProduits().catch(() => []),
    listerCommandes().catch(() => []),
  ]);

  const carteProduit = new Map<string, Produit>(
    produits.map((p) => [p.id, p]),
  );
  const commandesPeriode = filtrerParPeriode(commandes, cle).filter(
    (c) => c.statut !== "retour",
  );

  const stats = new Map<string, LigneTopVente>();
  for (const c of commandesPeriode) {
    const datcom = new Date(c.date);
    for (const a of c.articles) {
      const id = a.produit_id;
      const p = carteProduit.get(id) ?? null;
      const ligne =
        stats.get(id) ??
        ({
          produit: p,
          produit_id: id,
          nom: p?.nom ?? a.nom,
          image: p?.images?.[0]?.url ?? a.image,
          quantite: 0,
          revenu: 0,
          profit: 0,
          cout: 0,
          nbCommandes: 0,
          dernierAchat: null,
        } satisfies LigneTopVente);

      ligne.quantite += a.quantite;
      ligne.revenu += a.prix_unitaire * a.quantite;
      const prixAchat = Number(p?.prix_achat ?? 0);
      ligne.cout += prixAchat * a.quantite;
      ligne.profit += (a.prix_unitaire - prixAchat) * a.quantite;
      ligne.nbCommandes += 1;
      const iso = datcom.toISOString();
      if (!ligne.dernierAchat || iso > ligne.dernierAchat) {
        ligne.dernierAchat = iso;
      }
      stats.set(id, ligne);
    }
  }

  const idsVendus = new Set(stats.keys());
  const jamaisVendus = produits.filter((p) => !idsVendus.has(p.id));

  const lignes = [...stats.values()].sort((a, b) => {
    if (tri === "quantite") return b.quantite - a.quantite;
    if (tri === "profit") return b.profit - a.profit;
    if (tri === "commandes") return b.nbCommandes - a.nbCommandes;
    return b.revenu - a.revenu;
  });

  const totalRevenu = lignes.reduce((a, l) => a + l.revenu, 0);
  const totalQuantite = lignes.reduce((a, l) => a + l.quantite, 0);
  const totalProfit = lignes.reduce((a, l) => a + l.profit, 0);
  const maxRevenu = lignes[0]?.revenu ?? 0;
  const meilleur = lignes[0];

  const colonnesTri: { cle: typeof tri; label: string }[] = [
    { cle: "revenu", label: "Revenu" },
    { cle: "quantite", label: "Quantité" },
    { cle: "profit", label: "Profit" },
    { cle: "commandes", label: "Commandes" },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl text-charbon">Top ventes</h1>
        <p className="text-charbon/55 text-xs mt-0.5">
          Pièces les plus performantes et candidates à relancer.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex bg-white border border-charbon/10">
          {PERIODES.map((p) => {
            const actif = p.cle === cle;
            return (
              <Link
                key={p.cle}
                href={`/admin/top-ventes?periode=${p.cle}&tri=${tri}`}
                className={`px-3 py-1.5 text-[11px] tracking-luxe uppercase transition-colors ${
                  actif
                    ? "bg-charbon text-white"
                    : "text-charbon/65 hover:bg-fond-douce"
                }`}
              >
                {p.label}
              </Link>
            );
          })}
        </div>

        <div className="inline-flex items-center gap-2 text-[11px] tracking-luxe uppercase text-charbon/55">
          <span>Trier</span>
          <div className="inline-flex bg-white border border-charbon/10">
            {colonnesTri.map((c) => {
              const actif = c.cle === tri;
              return (
                <Link
                  key={c.cle}
                  href={`/admin/top-ventes?periode=${cle}&tri=${c.cle}`}
                  className={`px-3 py-1.5 transition-colors ${
                    actif
                      ? "bg-secondaire text-white"
                      : "text-charbon/65 hover:bg-fond-douce"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <RecapCard
          label="Pièces vendues"
          valeur={String(totalQuantite)}
          sous={`${lignes.length} référence${lignes.length > 1 ? "s" : ""}`}
        />
        <RecapCard
          label="Revenu généré"
          valeur={formatPrix(totalRevenu)}
          sous={`${commandesPeriode.length} commandes`}
        />
        <RecapCard
          label="Profit total"
          valeur={formatPrix(totalProfit)}
          sous={
            totalRevenu > 0
              ? `Marge ${Math.round((totalProfit / totalRevenu) * 100)} %`
              : "—"
          }
        />
        <RecapCard
          label="Pièce-phare"
          valeur={meilleur ? meilleur.nom : "—"}
          sous={
            meilleur
              ? `${meilleur.quantite} vendue${meilleur.quantite > 1 ? "s" : ""} · ${formatPrix(meilleur.revenu)}`
              : "Aucune vente sur la période"
          }
          texte
        />
      </div>

      <section className="bg-white border border-charbon/10 shadow-sm">
        <div className="px-4 py-3 border-b border-charbon/10 flex items-center justify-between">
          <h2 className="font-display text-base text-charbon">Classement</h2>
          <span className="text-[10px] tracking-luxe uppercase text-charbon/50">
            {lignes.length} pièce{lignes.length > 1 ? "s" : ""}
          </span>
        </div>
        <TopVentesTable
          lignes={lignes}
          totalRevenu={totalRevenu}
          maxRevenu={maxRevenu}
        />
      </section>

      {jamaisVendus.length > 0 && (
        <section className="bg-white border border-charbon/10 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base text-charbon">
              Sans vente sur la période
            </h2>
            <span className="text-[10px] tracking-luxe uppercase text-charbon/50">
              {jamaisVendus.length} pièce{jamaisVendus.length > 1 ? "s" : ""}
            </span>
          </div>
          <ul className="divide-y divide-charbon/5">
            {jamaisVendus.slice(0, 10).map((p) => (
              <li
                key={p.id}
                className="py-2 flex items-center gap-3 text-xs"
              >
                <div className="relative shrink-0 w-8 h-10 bg-fond-douce overflow-hidden rounded">
                  {p.images?.[0]?.url ? (
                    <Image
                      src={p.images[0].url}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/produits/${p.id}`}
                    className="text-[13px] text-charbon hover:text-secondaire transition-colors block truncate"
                  >
                    {p.nom}
                  </Link>
                  <p className="text-[10px] text-charbon/55 mt-0.5">
                    {formatPrix(Number(p.prix_vente))} ·{" "}
                    {p.statut === "en rupture" ? (
                      <span className="text-secondaire">En rupture</span>
                    ) : (
                      "En stock"
                    )}
                  </p>
                </div>
                <Link
                  href={`/admin/produits/${p.id}`}
                  className="text-[10px] tracking-luxe uppercase text-charbon/55 hover:text-secondaire"
                >
                  Modifier →
                </Link>
              </li>
            ))}
          </ul>
          {jamaisVendus.length > 10 && (
            <p className="mt-3 text-[10px] text-charbon/50 text-center">
              + {jamaisVendus.length - 10} autre{jamaisVendus.length - 10 > 1 ? "s" : ""}…
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function RecapCard({
  label,
  valeur,
  sous,
  texte = false,
}: {
  label: string;
  valeur: string;
  sous: string;
  texte?: boolean;
}) {
  return (
    <div className="bg-white border border-charbon/10 p-3">
      <p className="text-[10px] tracking-luxe uppercase text-charbon/50">
        {label}
      </p>
      <p
        className={`font-display text-charbon mt-1 ${
          texte ? "text-sm leading-tight line-clamp-2" : "text-xl"
        }`}
      >
        {valeur}
      </p>
      <p className="text-[11px] text-charbon/55 mt-0.5">{sous}</p>
    </div>
  );
}
