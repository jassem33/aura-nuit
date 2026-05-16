"use client";

import { useMemo, useState } from "react";

interface Props<T> {
  items: T[];
  pageSize?: number;
  renderHeader?: () => React.ReactNode;
  renderRow: (item: T, index: number) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  // Wrapper englobant l'en-tête + les lignes (utile pour <table>/<tbody>).
  wrap?: (children: React.ReactNode) => React.ReactNode;
  // Texte court (« commandes », « pièces »…) pour l'indicateur de plage.
  itemLabel?: string;
}

export function Pagination<T>({
  items,
  pageSize = 10,
  renderHeader,
  renderRow,
  renderEmpty,
  wrap,
  itemLabel = "éléments",
}: Props<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const debut = safePage * pageSize;
  const fin = Math.min(items.length, debut + pageSize);
  const visibles = useMemo(
    () => items.slice(debut, fin),
    [items, debut, fin],
  );

  const contenu =
    items.length === 0 && renderEmpty ? (
      renderEmpty()
    ) : (
      <>
        {renderHeader?.()}
        {visibles.map((it, i) => renderRow(it, debut + i))}
      </>
    );

  return (
    <div>
      {wrap ? wrap(contenu) : contenu}

      {items.length > pageSize && (
        <PaginationBar
          page={safePage}
          totalPages={totalPages}
          debut={debut + 1}
          fin={fin}
          total={items.length}
          itemLabel={itemLabel}
          onChange={setPage}
        />
      )}
    </div>
  );
}

function PaginationBar({
  page,
  totalPages,
  debut,
  fin,
  total,
  itemLabel,
  onChange,
}: {
  page: number;
  totalPages: number;
  debut: number;
  fin: number;
  total: number;
  itemLabel: string;
  onChange: (p: number) => void;
}) {
  const pages = pagesAffichees(page, totalPages);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-charbon/10 bg-fond-douce/40">
      <p className="text-[11px] text-charbon/60">
        {debut}–{fin} sur {total} {itemLabel}
      </p>
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, page - 1))}
          disabled={page === 0}
          className="px-2.5 py-1 text-xs border border-charbon/15 text-charbon/70 hover:border-charbon disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e-${i}`} className="px-1.5 text-xs text-charbon/40">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`min-w-[1.75rem] px-2 py-1 text-xs border transition-colors ${
                p === page
                  ? "bg-charbon text-white border-charbon"
                  : "border-charbon/15 text-charbon/70 hover:border-charbon"
              }`}
            >
              {p + 1}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className="px-2.5 py-1 text-xs border border-charbon/15 text-charbon/70 hover:border-charbon disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function pagesAffichees(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages: (number | "…")[] = [0];
  const start = Math.max(1, page - 1);
  const end = Math.min(total - 2, page + 1);
  if (start > 1) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 2) pages.push("…");
  pages.push(total - 1);
  return pages;
}
