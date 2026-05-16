import { NextRequest, NextResponse } from "next/server";

const COOKIE_NOM = "aura_nuit_admin";

/**
 * Vérification HMAC compatible Edge Runtime (Web Crypto API).
 */
async function verifierJeton(jeton: string | undefined): Promise<boolean> {
  if (!jeton) return false;
  const parts = jeton.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );
  const attendue = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (attendue.length !== signature.length) return false;
  // Comparaison à temps constant
  let diff = 0;
  for (let i = 0; i < attendue.length; i++) {
    diff |= attendue.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (diff !== 0) return false;

  const expiration = parseInt(payload, 10);
  if (!Number.isFinite(expiration)) return false;
  return Date.now() < expiration;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ne protège que /admin (sauf la page de connexion).
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const jeton = req.cookies.get(COOKIE_NOM)?.value;
  const ok = await verifierJeton(jeton);

  if (!ok) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(COOKIE_NOM);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
