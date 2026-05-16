import { NextResponse } from "next/server";
import { listerProduitsPublic } from "@/lib/produits-public";

export const revalidate = 60;

export async function GET() {
  try {
    const produits = await listerProduitsPublic();
    return NextResponse.json(produits, {
      headers: {
        "Cache-Control":
          "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
