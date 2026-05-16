import "server-only";

import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE_NOM = "aura_nuit_admin";
const DUREE_SESSION_MS = 1000 * 60 * 60 * 12; // 12 heures

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET manquant ou trop court (minimum 16 caractères).",
    );
  }
  return secret;
}

function signer(payload: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
}

/**
 * Crée un jeton de session signé : "<expiration>.<hmac>"
 */
export function creerJetonSession(): string {
  const expiration = Date.now() + DUREE_SESSION_MS;
  const payload = String(expiration);
  const signature = signer(payload);
  return `${payload}.${signature}`;
}

export function jetonValide(jeton: string | undefined): boolean {
  if (!jeton) return false;
  const parts = jeton.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  const attendue = signer(payload);
  // Comparaison à temps constant
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(attendue, "hex");
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  const expiration = parseInt(payload, 10);
  if (!Number.isFinite(expiration)) return false;
  return Date.now() < expiration;
}

export function cookieAdminNom() {
  return COOKIE_NOM;
}

export function dureeSessionSecondes() {
  return Math.floor(DUREE_SESSION_MS / 1000);
}

/**
 * Vérifie si la requête courante est authentifiée admin.
 * Utilisable dans les Server Components / Server Actions.
 */
export function estAdminAuthentifie(): boolean {
  const jeton = cookies().get(COOKIE_NOM)?.value;
  return jetonValide(jeton);
}

export function verifierMotDePasse(motDePasse: string): boolean {
  const cible = process.env.ADMIN_PASSWORD;
  if (!cible) {
    throw new Error("ADMIN_PASSWORD manquant dans .env.local.");
  }
  const a = Buffer.from(motDePasse);
  const b = Buffer.from(cible);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
