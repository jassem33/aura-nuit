"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  creerProduit,
  mettreAJourProduit,
  type EtatProduit,
} from "@/actions/produits";
import type {
  CouleurProduit,
  ImageProduit,
  Produit,
  StatutProduit,
  TypeAvecSousTypes,
} from "@/types/database";
import {
  calculerProfit,
  formatPrix,
  margeBeneficiaire,
  pourcentageReduction,
} from "@/lib/utils";
import { ImageUploader } from "./ImageUploader";

interface Props {
  produit?: Produit;
  categories?: TypeAvecSousTypes[];
}

const TAILLES_DISPO = ["XS", "S", "M", "L", "XL", "XXL", "Unique"];

export function ProductForm({ produit, categories = [] }: Props) {
  const [sousTypeId, setSousTypeId] = useState<string>(
    produit?.sous_type_id ?? "",
  );
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [etat, setEtat] = useState<EtatProduit>({});

  const [nom, setNom] = useState(produit?.nom ?? "");
  const [description, setDescription] = useState(produit?.description ?? "");
  const [statut, setStatut] = useState<StatutProduit>(produit?.statut ?? "en stock");
  const [prixAchat, setPrixAchat] = useState<string>(
    produit ? String(produit.prix_achat) : "",
  );
  const [prixOriginal, setPrixOriginal] = useState<string>(
    produit ? String(produit.prix_original) : "",
  );
  const [prixVente, setPrixVente] = useState<string>(
    produit ? String(produit.prix_vente) : "",
  );
  const [couleurs, setCouleurs] = useState<CouleurProduit[]>(
    (produit?.couleurs ?? []).map((c) => ({
      ...c,
      tailles: Array.isArray(c.tailles) ? c.tailles : [],
    })),
  );
  const [images, setImages] = useState<ImageProduit[]>(produit?.images ?? []);

  // Nouvelle couleur en cours de saisie
  const [nouvCouleurNom, setNouvCouleurNom] = useState("");
  const [nouvCouleurHex, setNouvCouleurHex] = useState("#DCAE96");
  const [nouvCouleurStock, setNouvCouleurStock] = useState<string>("0");

  function ajouterCouleur() {
    if (!nouvCouleurNom.trim()) return;
    if (!/^#[0-9a-fA-F]{6}$/.test(nouvCouleurHex)) return;
    const stockInit = Math.max(0, Math.floor(Number(nouvCouleurStock) || 0));
    setCouleurs([
      ...couleurs,
      {
        nom: nouvCouleurNom.trim(),
        hex: nouvCouleurHex,
        stock: stockInit,
        tailles: [],
      },
    ]);
    setNouvCouleurNom("");
    setNouvCouleurStock("0");
  }
  function retirerCouleur(i: number) {
    setCouleurs(couleurs.filter((_, idx) => idx !== i));
  }
  function majStockCouleur(i: number, valeur: string) {
    const n = Math.max(0, Math.floor(Number(valeur) || 0));
    setCouleurs(
      couleurs.map((c, idx) => (idx === i ? { ...c, stock: n } : c)),
    );
  }
  function basculerTailleCouleur(i: number, t: string) {
    setCouleurs(
      couleurs.map((c, idx) => {
        if (idx !== i) return c;
        const tailles = c.tailles ?? [];
        return {
          ...c,
          tailles: tailles.includes(t)
            ? tailles.filter((x) => x !== t)
            : [...tailles, t],
        };
      }),
    );
  }

  function soumettre(formData: FormData) {
    // `tailles` au niveau produit = union de toutes les tailles par couleur
    // (utilisé par la navbar, les filtres catégorie, etc.).
    const taillesUnion = Array.from(
      new Set(couleurs.flatMap((c) => c.tailles ?? [])),
    );
    formData.set("couleurs", JSON.stringify(couleurs));
    formData.set("tailles", JSON.stringify(taillesUnion));
    formData.set("images", JSON.stringify(images));
    formData.set("sous_type_id", sousTypeId);

    startTransition(async () => {
      const action = produit
        ? mettreAJourProduit.bind(null, produit.id)
        : creerProduit;
      const res = await action(etat, formData);
      setEtat(res);
      if (res.succes) {
        router.push("/admin/produits");
        router.refresh();
      }
    });
  }

  const pAchat = parseFloat(prixAchat || "0");
  const pOrig = parseFloat(prixOriginal || "0");
  const pVente = parseFloat(prixVente || "0");
  const profit = calculerProfit(pAchat, pVente);
  const marge = margeBeneficiaire(pAchat, pVente);
  const reduction =
    pOrig > 0 && pVente < pOrig ? pourcentageReduction(pOrig, pVente) : 0;

  return (
    <form action={soumettre} className="space-y-8">
      <div className="bg-white shadow-elegance p-6 md:p-8 space-y-6">
        <div>
          <label htmlFor="nom" className="etiquette">
            Nom du produit
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="champ"
            placeholder="Robe Aura"
          />
          {etat.champErreurs?.nom && (
            <p className="mt-1 text-xs text-secondaire">{etat.champErreurs.nom}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="etiquette">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            className="champ resize-none"
            placeholder="Décrivez la pièce, ses matières, son inspiration…"
          />
        </div>

        <div>
          <label className="etiquette">Statut</label>
          <div className="flex gap-2">
            {(["en stock", "en rupture"] as StatutProduit[]).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStatut(s)}
                className={`px-4 py-2 text-xs tracking-luxe uppercase border transition-all ${
                  statut === s
                    ? s === "en stock"
                      ? "bg-charbon text-white border-charbon"
                      : "bg-secondaire text-white border-secondaire"
                    : "border-charbon/20 text-charbon/60 hover:border-charbon"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <input type="hidden" name="statut" value={statut} />
        </div>

        <div>
          <label htmlFor="sous_type_id" className="etiquette">
            Catégorie (sous-type)
          </label>
          <select
            id="sous_type_id"
            value={sousTypeId}
            onChange={(e) => setSousTypeId(e.target.value)}
            className="champ"
          >
            <option value="">— Aucune —</option>
            {categories.map((t) => (
              <optgroup key={t.id} label={t.nom}>
                {t.sous_types.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.nom}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="mt-1 text-xs text-charbon/50">
              Aucune catégorie n&apos;a encore été créée.{" "}
              <a
                href="/admin/categories"
                className="text-secondaire hover:underline"
              >
                Gérer les catégories →
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Prix & finance */}
      <div className="bg-white shadow-elegance p-6 md:p-8">
        <h2 className="font-display text-xl mb-5">Tarification</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="prix_achat" className="etiquette">
              Prix d&apos;achat
            </label>
            <input
              id="prix_achat"
              name="prix_achat"
              type="number"
              step="0.01"
              min="0"
              value={prixAchat}
              onChange={(e) => setPrixAchat(e.target.value)}
              className="champ"
              placeholder="0,00"
              required
            />
          </div>
          <div>
            <label htmlFor="prix_original" className="etiquette">
              Prix original
            </label>
            <input
              id="prix_original"
              name="prix_original"
              type="number"
              step="0.01"
              min="0"
              value={prixOriginal}
              onChange={(e) => setPrixOriginal(e.target.value)}
              className="champ"
              placeholder="0,00"
              required
            />
          </div>
          <div>
            <label htmlFor="prix_vente" className="etiquette">
              Prix de vente
            </label>
            <input
              id="prix_vente"
              name="prix_vente"
              type="number"
              step="0.01"
              min="0"
              value={prixVente}
              onChange={(e) => setPrixVente(e.target.value)}
              className="champ"
              placeholder="0,00"
              required
            />
          </div>
        </div>

        <div className="filet-or my-6" />

        <div className="grid sm:grid-cols-3 gap-5 text-sm">
          <div>
            <p className="text-[10px] tracking-luxe uppercase text-charbon/50 mb-1">
              Profit par pièce
            </p>
            <p
              className={`font-display text-2xl ${profit >= 0 ? "text-green-700" : "text-secondaire"}`}
            >
              {formatPrix(profit)}
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-luxe uppercase text-charbon/50 mb-1">
              Marge bénéficiaire
            </p>
            <p className="font-display text-2xl text-charbon">{marge}%</p>
          </div>
          <div>
            <p className="text-[10px] tracking-luxe uppercase text-charbon/50 mb-1">
              Promotion
            </p>
            <p className="font-display text-2xl text-charbon">
              {reduction > 0 ? `−${reduction}%` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Couleurs */}
      <div className="bg-white shadow-elegance p-6 md:p-8">
        <h2 className="font-display text-xl mb-5">Couleurs disponibles</h2>

        <div className="space-y-3 mb-5">
          {couleurs.map((c, i) => (
            <div
              key={i}
              className="border border-charbon/15 bg-fond-douce p-3"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full border border-charbon/10"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-sm font-medium">{c.nom}</span>
                <label className="flex items-center gap-1 text-[10px] tracking-luxe uppercase text-charbon/60">
                  Stock
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={c.stock ?? 0}
                    onChange={(e) => majStockCouleur(i, e.target.value)}
                    className="w-16 px-1.5 py-0.5 text-xs border border-charbon/15 bg-white text-charbon"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => retirerCouleur(i)}
                  className="ml-auto text-charbon/40 hover:text-secondaire text-lg leading-none"
                  aria-label="Retirer"
                >
                  ×
                </button>
              </div>
              <div className="mt-3">
                <p className="text-[10px] tracking-luxe uppercase text-charbon/60 mb-1.5">
                  Tailles pour cette couleur
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {TAILLES_DISPO.map((t) => {
                    const active = (c.tailles ?? []).includes(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => basculerTailleCouleur(i, t)}
                        className={`min-w-[2.75rem] px-2.5 py-1 text-xs border transition-all ${
                          active
                            ? "bg-charbon text-white border-charbon"
                            : "border-charbon/20 text-charbon hover:border-charbon"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="etiquette" htmlFor="couleur-nom">
              Nom
            </label>
            <input
              id="couleur-nom"
              type="text"
              value={nouvCouleurNom}
              onChange={(e) => setNouvCouleurNom(e.target.value)}
              className="champ"
              placeholder="Nuit profonde"
            />
          </div>
          <div>
            <label className="etiquette" htmlFor="couleur-hex">
              Code couleur
            </label>
            <div className="flex items-center gap-2">
              <input
                id="couleur-hex"
                type="color"
                value={nouvCouleurHex}
                onChange={(e) => setNouvCouleurHex(e.target.value)}
                className="h-12 w-14 border border-charbon/15 cursor-pointer"
              />
              <input
                type="text"
                value={nouvCouleurHex}
                onChange={(e) => setNouvCouleurHex(e.target.value)}
                className="champ w-28 font-mono"
                pattern="^#[0-9a-fA-F]{6}$"
              />
            </div>
          </div>
          <div>
            <label className="etiquette" htmlFor="couleur-stock">
              Stock
            </label>
            <input
              id="couleur-stock"
              type="number"
              min="0"
              step="1"
              value={nouvCouleurStock}
              onChange={(e) => setNouvCouleurStock(e.target.value)}
              className="champ w-24"
              placeholder="0"
            />
          </div>
          <button
            type="button"
            onClick={ajouterCouleur}
            className="btn-contour"
          >
            Ajouter la couleur
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white shadow-elegance p-6 md:p-8">
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Messages & actions */}
      {etat.erreur && (
        <p className="text-sm text-secondaire bg-secondaire/5 p-3 border border-secondaire/20">
          {etat.erreur}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/admin/produits")}
          className="btn-contour"
        >
          Annuler
        </button>
        <button type="submit" disabled={pending} className="btn-or disabled:opacity-50">
          {pending
            ? "Enregistrement…"
            : produit
              ? "Enregistrer les modifications"
              : "Créer le produit"}
        </button>
      </div>
    </form>
  );
}
