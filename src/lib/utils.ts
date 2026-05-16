import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tunisian dinar — formaté à la française avec le suffixe « dt ».
const formatterTND = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrix(valeur: number | string | null | undefined): string {
  const n =
    typeof valeur === "string" ? parseFloat(valeur) : (valeur ?? 0);
  const valide = Number.isFinite(n) ? n : 0;
  return `${formatterTND.format(valide)} dt`;
}

export function pourcentageReduction(
  prixOriginal: number,
  prixVente: number,
): number {
  if (!prixOriginal || prixOriginal <= 0) return 0;
  if (prixVente >= prixOriginal) return 0;
  return Math.round(((prixOriginal - prixVente) / prixOriginal) * 100);
}

export function calculerProfit(prixAchat: number, prixVente: number): number {
  return Math.round((prixVente - prixAchat) * 100) / 100;
}

export function margeBeneficiaire(
  prixAchat: number,
  prixVente: number,
): number {
  if (!prixVente || prixVente <= 0) return 0;
  return Math.round(((prixVente - prixAchat) / prixVente) * 100);
}

const formatterDate = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatterDate.format(d);
}

export function slugify(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
