"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { supprimerProduit } from "@/actions/produits";

export function BoutonSupprimerProduit({
  id,
  nom,
}: {
  id: string;
  nom: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function clic() {
    const ok = window.confirm(
      `Supprimer définitivement « ${nom} » ?\nLes images associées seront aussi supprimées.`,
    );
    if (!ok) return;
    startTransition(async () => {
      try {
        await supprimerProduit(id);
        router.refresh();
      } catch (e) {
        alert(`Erreur : ${(e as Error).message}`);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={clic}
      disabled={pending}
      className="text-xs tracking-luxe uppercase text-secondaire hover:underline disabled:opacity-50"
    >
      {pending ? "…" : "Supprimer"}
    </button>
  );
}
