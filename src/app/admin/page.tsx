import Link from "next/link";
import { listerProduits } from "@/actions/produits";
import { listerCommandes } from "@/actions/commandes";
import { formatPrix } from "@/lib/utils";
import type { Commande } from "@/types/database";

export const dynamic = "force-dynamic";

const JOURS_FENETRE = 30;
const MS_JOUR = 24 * 60 * 60 * 1000;

function debutJour(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function diffPct(courant: number, anterieur: number): number | null {
  if (anterieur === 0) return courant > 0 ? 100 : null;
  return Math.round(((courant - anterieur) / anterieur) * 100);
}

export default async function PageDashboard() {
  const [produits, commandes] = await Promise.all([
    listerProduits().catch(() => []),
    listerCommandes().catch(() => []),
  ]);

  const maintenant = new Date();
  const debutFenetre = debutJour(
    new Date(maintenant.getTime() - (JOURS_FENETRE - 1) * MS_JOUR),
  );
  const debutFenetrePrec = debutJour(
    new Date(debutFenetre.getTime() - JOURS_FENETRE * MS_JOUR),
  );

  // ===== KPIs périodes =====
  const dansFenetre = (c: Commande, debut: Date, fin: Date) => {
    const d = new Date(c.date);
    return d >= debut && d < fin;
  };
  const finFenetre = new Date(maintenant.getTime() + MS_JOUR);
  const commandesPeriode = commandes.filter((c) =>
    dansFenetre(c, debutFenetre, finFenetre),
  );
  const commandesPeriodePrec = commandes.filter((c) =>
    dansFenetre(c, debutFenetrePrec, debutFenetre),
  );

  const revenuTotal = (lst: Commande[]) =>
    lst
      .filter((c) => c.statut !== "retour")
      .reduce((acc, c) => acc + Number(c.total), 0);

  const revenuCourant = revenuTotal(commandesPeriode);
  const revenuPrec = revenuTotal(commandesPeriodePrec);
  const revenuDelta = diffPct(revenuCourant, revenuPrec);

  const nbCmdDelta = diffPct(commandesPeriode.length, commandesPeriodePrec.length);

  const panierMoyenCourant =
    commandesPeriode.length > 0
      ? revenuCourant / commandesPeriode.length
      : 0;
  const panierMoyenPrec =
    commandesPeriodePrec.length > 0
      ? revenuPrec / commandesPeriodePrec.length
      : 0;
  const panierDelta = diffPct(panierMoyenCourant, panierMoyenPrec);

  // ===== Profit =====
  const cartePrixAchat = new Map(produits.map((p) => [p.id, Number(p.prix_achat)]));
  const profitDe = (lst: Commande[]) =>
    lst
      .filter((c) => c.statut !== "retour")
      .reduce((acc, c) => {
        return (
          acc +
          c.articles.reduce((accA, a) => {
            const achat = cartePrixAchat.get(a.produit_id) ?? 0;
            return accA + (a.prix_unitaire - achat) * a.quantite;
          }, 0)
        );
      }, 0);
  const profitCourant = profitDe(commandesPeriode);
  const margeCourante =
    revenuCourant > 0 ? Math.round((profitCourant / revenuCourant) * 100) : 0;

  // ===== Statuts =====
  const statuts = ["en attente", "confirmé", "livré", "retour"] as const;
  const repartition = statuts.map((s) => ({
    statut: s,
    nb: commandes.filter((c) => c.statut === s).length,
  }));
  const totalCommandes = commandes.length;

  // ===== Série journalière (30 jours) =====
  const series: { date: Date; revenu: number; nb: number }[] = [];
  for (let i = 0; i < JOURS_FENETRE; i++) {
    const j = debutJour(new Date(debutFenetre.getTime() + i * MS_JOUR));
    series.push({ date: j, revenu: 0, nb: 0 });
  }
  for (const c of commandesPeriode) {
    if (c.statut === "retour") continue;
    const d = debutJour(new Date(c.date));
    const idx = Math.floor((d.getTime() - debutFenetre.getTime()) / MS_JOUR);
    if (idx >= 0 && idx < series.length) {
      series[idx].revenu += Number(c.total);
      series[idx].nb += 1;
    }
  }

  // ===== Top produits =====
  const stats = new Map<
    string,
    { id: string; nom: string; quantite: number; revenu: number; image?: string }
  >();
  for (const c of commandesPeriode) {
    if (c.statut === "retour") continue;
    for (const a of c.articles) {
      const cle = a.produit_id;
      const courant =
        stats.get(cle) ?? {
          id: cle,
          nom: a.nom,
          quantite: 0,
          revenu: 0,
          image: a.image,
        };
      courant.quantite += a.quantite;
      courant.revenu += a.prix_unitaire * a.quantite;
      stats.set(cle, courant);
    }
  }
  const topProduits = [...stats.values()]
    .sort((a, b) => b.revenu - a.revenu)
    .slice(0, 5);
  const maxRevenuTop = topProduits[0]?.revenu ?? 0;

  // ===== Inventaire =====
  const enStock = produits.filter((p) => p.statut === "en stock").length;
  const enRupture = produits.length - enStock;
  const produitsEnRupture = produits.filter((p) => p.statut === "en rupture");

  const dernieresCommandes = commandes.slice(0, 6);

  const kpis: Kpi[] = [
    {
      label: `Revenu · ${JOURS_FENETRE} j`,
      valeur: formatPrix(revenuCourant),
      delta: revenuDelta,
      sous: `vs ${formatPrix(revenuPrec)} période précédente`,
    },
    {
      label: `Commandes · ${JOURS_FENETRE} j`,
      valeur: String(commandesPeriode.length),
      delta: nbCmdDelta,
      sous: `${commandesPeriodePrec.length} sur période précédente`,
    },
    {
      label: "Panier moyen",
      valeur: formatPrix(panierMoyenCourant),
      delta: panierDelta,
      sous: panierMoyenPrec > 0 ? `vs ${formatPrix(panierMoyenPrec)}` : "—",
    },
    {
      label: "Profit · 30 j",
      valeur: formatPrix(profitCourant),
      delta: null,
      sous: revenuCourant > 0 ? `Marge ${margeCourante} %` : "—",
    },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl text-charbon">
            Tableau de bord
          </h1>
          <p className="text-charbon/55 text-xs mt-0.5">
            Vue d&apos;ensemble — {JOURS_FENETRE} derniers jours.
          </p>
        </div>
      </header>

      {/* Bandes d'alertes */}
      {(commandes.filter((c) => c.statut === "en attente").length > 0 ||
        produitsEnRupture.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {commandes.filter((c) => c.statut === "en attente").length > 0 && (
            <Link
              href="/admin/commandes"
              className="bg-accent/10 border border-accent/30 px-4 py-3 flex items-center gap-3 hover:bg-accent/15 transition-colors"
            >
              <span className="font-display text-xl text-accent">
                {commandes.filter((c) => c.statut === "en attente").length}
              </span>
              <div className="flex-1">
                <p className="text-xs text-charbon font-medium">Commandes en attente</p>
                <p className="text-[11px] text-charbon/60">À traiter rapidement</p>
              </div>
              <span className="text-[10px] tracking-luxe uppercase text-charbon/55">
                Voir →
              </span>
            </Link>
          )}
          {produitsEnRupture.length > 0 && (
            <Link
              href="/admin/produits"
              className="bg-secondaire/10 border border-secondaire/30 px-4 py-3 flex items-center gap-3 hover:bg-secondaire/15 transition-colors"
            >
              <span className="font-display text-xl text-secondaire">
                {produitsEnRupture.length}
              </span>
              <div className="flex-1">
                <p className="text-xs text-charbon font-medium">Pièces en rupture</p>
                <p className="text-[11px] text-charbon/60">À réapprovisionner</p>
              </div>
              <span className="text-[10px] tracking-luxe uppercase text-charbon/55">
                Voir →
              </span>
            </Link>
          )}
        </div>
      )}

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <KpiCard key={k.label} kpi={k} />
        ))}
      </div>

      {/* Graphes principaux */}
      <div className="grid lg:grid-cols-3 gap-3">
        <section className="bg-white border border-charbon/10 shadow-sm p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] tracking-luxe uppercase text-charbon/50">
                Évolution du revenu
              </p>
              <p className="font-display text-xl text-charbon mt-0.5">
                {formatPrix(revenuCourant)}
              </p>
            </div>
            {revenuDelta !== null && (
              <Delta valeur={revenuDelta} />
            )}
          </div>
          <RevenuChart series={series} />
        </section>

        <section className="bg-white border border-charbon/10 shadow-sm p-4">
          <p className="text-[10px] tracking-luxe uppercase text-charbon/50 mb-1">
            Statuts des commandes
          </p>
          <p className="font-display text-xl text-charbon mb-4">
            {totalCommandes} total
          </p>
          <Donut
            segments={repartition.map((r) => ({
              label: r.statut,
              valeur: r.nb,
            }))}
          />
          <ul className="mt-4 space-y-1.5 text-xs">
            {repartition.map((r) => (
              <li key={r.statut} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-charbon/70">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: couleurStatut(r.statut) }}
                  />
                  <span className="capitalize">{r.statut}</span>
                </span>
                <span className="text-charbon font-medium">{r.nb}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Top produits + commandes */}
      <div className="grid lg:grid-cols-2 gap-3">
        <section className="bg-white border border-charbon/10 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] tracking-luxe uppercase text-charbon/50">
                Top pièces · {JOURS_FENETRE} j
              </p>
              <p className="font-display text-lg text-charbon mt-0.5">
                Meilleures ventes
              </p>
            </div>
            <Link
              href="/admin/produits"
              className="text-[10px] tracking-luxe uppercase text-charbon/55 hover:text-secondaire"
            >
              Produits →
            </Link>
          </div>

          {topProduits.length === 0 ? (
            <p className="text-charbon/55 text-xs py-6 text-center">
              Aucune vente sur la période.
            </p>
          ) : (
            <ul className="space-y-3">
              {topProduits.map((p, i) => (
                <li key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-2">
                      <span className="font-display text-secondaire italic">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-charbon font-medium truncate max-w-[180px]">
                        {p.nom}
                      </span>
                    </span>
                    <span className="text-charbon">{formatPrix(p.revenu)}</span>
                  </div>
                  <div className="relative h-1.5 bg-fond-douce rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondaire to-accent rounded-full"
                      style={{
                        width: `${
                          maxRevenuTop > 0 ? (p.revenu / maxRevenuTop) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-charbon/55">
                    {p.quantite} pièce{p.quantite > 1 ? "s" : ""} vendue
                    {p.quantite > 1 ? "s" : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-charbon/10 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] tracking-luxe uppercase text-charbon/50">
                Activité récente
              </p>
              <p className="font-display text-lg text-charbon mt-0.5">
                Dernières commandes
              </p>
            </div>
            <Link
              href="/admin/commandes"
              className="text-[10px] tracking-luxe uppercase text-charbon/55 hover:text-secondaire"
            >
              Tout voir →
            </Link>
          </div>

          {dernieresCommandes.length === 0 ? (
            <p className="text-charbon/55 text-xs py-6 text-center">
              Aucune commande pour le moment.
            </p>
          ) : (
            <ul className="divide-y divide-charbon/10">
              {dernieresCommandes.map((c) => (
                <li
                  key={c.id}
                  className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-medium text-charbon">{c.nom_client}</p>
                    <p className="text-[10px] text-charbon/50 mt-0.5">
                      #{c.id.slice(0, 8).toUpperCase()} ·{" "}
                      {new Date(c.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-charbon">{formatPrix(c.total)}</span>
                    <StatutBadge statut={c.statut} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Pied : inventaire */}
      <section className="bg-white border border-charbon/10 shadow-sm p-4">
        <div className="grid sm:grid-cols-3 gap-6">
          <Stat
            label="Total catalogue"
            valeur={String(produits.length)}
            sous="pièces référencées"
          />
          <Stat
            label="En stock"
            valeur={String(enStock)}
            sous={`${
              produits.length > 0
                ? Math.round((enStock / produits.length) * 100)
                : 0
            } % du catalogue`}
            couleur="text-green-700"
          />
          <Stat
            label="En rupture"
            valeur={String(enRupture)}
            sous={`${
              produits.length > 0
                ? Math.round((enRupture / produits.length) * 100)
                : 0
            } % du catalogue`}
            couleur={enRupture > 0 ? "text-secondaire" : "text-charbon/60"}
          />
        </div>
      </section>
    </div>
  );
}

// ============================================================
// Sous-composants
// ============================================================

type Kpi = {
  label: string;
  valeur: string;
  delta: number | null;
  sous: string;
};

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="bg-white border border-charbon/10 shadow-sm p-4">
      <p className="text-[10px] tracking-luxe uppercase text-charbon/50">
        {kpi.label}
      </p>
      <div className="mt-1.5 flex items-baseline gap-2.5">
        <p className="font-display text-xl text-charbon">{kpi.valeur}</p>
        {kpi.delta !== null && <Delta valeur={kpi.delta} />}
      </div>
      <p className="text-[11px] text-charbon/55 mt-1.5">{kpi.sous}</p>
    </div>
  );
}

function Delta({ valeur }: { valeur: number }) {
  const positif = valeur >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded ${
        positif
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      <span aria-hidden>{positif ? "▲" : "▼"}</span>
      {Math.abs(valeur)} %
    </span>
  );
}

function Stat({
  label,
  valeur,
  sous,
  couleur,
}: {
  label: string;
  valeur: string;
  sous: string;
  couleur?: string;
}) {
  return (
    <div>
      <p className="text-[10px] tracking-luxe uppercase text-charbon/50">
        {label}
      </p>
      <p className={`font-display text-2xl mt-1 ${couleur ?? "text-charbon"}`}>
        {valeur}
      </p>
      <p className="text-[11px] text-charbon/55 mt-0.5">{sous}</p>
    </div>
  );
}

function RevenuChart({
  series,
}: {
  series: { date: Date; revenu: number; nb: number }[];
}) {
  const W = 600;
  const H = 140;
  const PAD_X = 8;
  const PAD_Y = 12;
  const max = Math.max(1, ...series.map((s) => s.revenu));
  const dx = (W - PAD_X * 2) / Math.max(1, series.length - 1);

  const points = series.map((s, i) => {
    const x = PAD_X + i * dx;
    const y = H - PAD_Y - (s.revenu / max) * (H - PAD_Y * 2);
    return { x, y };
  });

  const ligne = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");
  const aire = `${ligne} L${points[points.length - 1]?.x ?? PAD_X},${H - PAD_Y} L${PAD_X},${H - PAD_Y} Z`;

  // Étiquettes : début, milieu, fin
  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H + 22}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="grad-revenu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B76E79" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#B76E79" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grille horizontale légère */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={PAD_Y + (H - PAD_Y * 2) * p}
            y2={PAD_Y + (H - PAD_Y * 2) * p}
            stroke="#2C2C2C"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        ))}
        {points.length > 1 && (
          <>
            <path d={aire} fill="url(#grad-revenu)" />
            <path
              d={ligne}
              fill="none"
              stroke="#B76E79"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {points.map((p, i) =>
              series[i].revenu > 0 ? (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="2"
                  fill="#B76E79"
                />
              ) : null,
            )}
          </>
        )}
        {/* étiquettes des dates */}
        <text x={PAD_X} y={H + 14} fontSize="9" fill="#2C2C2C" fillOpacity="0.5">
          {fmt(series[0]?.date ?? new Date())}
        </text>
        <text
          x={W / 2}
          y={H + 14}
          fontSize="9"
          fill="#2C2C2C"
          fillOpacity="0.5"
          textAnchor="middle"
        >
          {fmt(series[Math.floor(series.length / 2)]?.date ?? new Date())}
        </text>
        <text
          x={W - PAD_X}
          y={H + 14}
          fontSize="9"
          fill="#2C2C2C"
          fillOpacity="0.5"
          textAnchor="end"
        >
          {fmt(series[series.length - 1]?.date ?? new Date())}
        </text>
      </svg>
    </div>
  );
}

function couleurStatut(s: string): string {
  switch (s) {
    case "en attente":
      return "#D4AF37";
    case "confirmé":
      return "#DCAE96";
    case "livré":
      return "#4F9D69";
    case "retour":
      return "#B76E79";
    default:
      return "#2C2C2C";
  }
}

function Donut({
  segments,
}: {
  segments: { label: string; valeur: number }[];
}) {
  const total = segments.reduce((a, s) => a + s.valeur, 0);
  const R = 38;
  const r = 26;
  const cx = 56;
  const cy = 56;

  if (total === 0) {
    return (
      <div className="flex justify-center">
        <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden="true">
          <circle cx={cx} cy={cy} r={R} fill="#F8F9FA" />
          <circle cx={cx} cy={cy} r={r} fill="#fff" />
          <text
            x={cx}
            y={cy + 3}
            fontSize="10"
            textAnchor="middle"
            fill="#2C2C2C"
            fillOpacity="0.5"
          >
            —
          </text>
        </svg>
      </div>
    );
  }

  let angle = -Math.PI / 2;
  const paths = segments
    .filter((s) => s.valeur > 0)
    .map((s) => {
      const portion = s.valeur / total;
      const a1 = angle;
      const a2 = angle + portion * Math.PI * 2;
      angle = a2;
      const x1 = cx + R * Math.cos(a1);
      const y1 = cy + R * Math.sin(a1);
      const x2 = cx + R * Math.cos(a2);
      const y2 = cy + R * Math.sin(a2);
      const grand = portion > 0.5 ? 1 : 0;
      const ix1 = cx + r * Math.cos(a2);
      const iy1 = cy + r * Math.sin(a2);
      const ix2 = cx + r * Math.cos(a1);
      const iy2 = cy + r * Math.sin(a1);
      const d = [
        `M${x1},${y1}`,
        `A${R},${R} 0 ${grand} 1 ${x2},${y2}`,
        `L${ix1},${iy1}`,
        `A${r},${r} 0 ${grand} 0 ${ix2},${iy2}`,
        "Z",
      ].join(" ");
      return { d, fill: couleurStatut(s.label) };
    });

  return (
    <div className="flex justify-center">
      <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden="true">
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.fill} />
        ))}
        <text
          x={cx}
          y={cy - 2}
          fontSize="14"
          textAnchor="middle"
          fill="#2C2C2C"
          fontWeight="600"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 12}
          fontSize="8"
          textAnchor="middle"
          fill="#2C2C2C"
          fillOpacity="0.55"
        >
          commandes
        </text>
      </svg>
    </div>
  );
}

function StatutBadge({ statut }: { statut: string }) {
  const map: Record<string, string> = {
    "en attente": "bg-accent/15 text-charbon",
    "confirmé": "bg-primaire/25 text-charbon",
    "livré": "bg-green-100 text-green-800",
    "retour": "bg-secondaire/15 text-secondaire",
  };
  return (
    <span
      className={`text-[9px] tracking-luxe uppercase px-2 py-0.5 ${map[statut] ?? "bg-fond-douce"}`}
    >
      {statut}
    </span>
  );
}
