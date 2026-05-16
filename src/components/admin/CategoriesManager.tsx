"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  creerSousType,
  creerType,
  mettreAJourSousType,
  mettreAJourType,
  supprimerSousType,
  supprimerType,
} from "@/actions/categories";
import type { SousTypeProduit, TypeProduit } from "@/types/database";
import { IconePicker } from "./IconePicker";
import { IconeCategorie } from "@/components/IconeCategorie";

interface Props {
  types: TypeProduit[];
  sousTypes: SousTypeProduit[];
}

interface FormState {
  nom: string;
  ordre: string;
  icone: string;
}

const FORM_VIDE: FormState = { nom: "", ordre: "0", icone: "" };

export function CategoriesManager({ types, sousTypes }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    txt: string;
  } | null>(null);

  const [nouvType, setNouvType] = useState<FormState>(FORM_VIDE);
  const [nouvSousType, setNouvSousType] = useState<Record<string, FormState>>(
    {},
  );
  const [editType, setEditType] = useState<Record<string, FormState>>({});
  const [editSousType, setEditSousType] = useState<Record<string, FormState>>(
    {},
  );

  function notif(ok: boolean, txt: string) {
    setMessage({ type: ok ? "ok" : "err", txt });
    setTimeout(() => setMessage(null), 3000);
  }
  function rafraichir() {
    router.refresh();
  }

  function ajouterType() {
    if (!nouvType.nom.trim()) return;
    const fd = new FormData();
    fd.set("nom", nouvType.nom.trim());
    fd.set("ordre", nouvType.ordre || "0");
    fd.set("icone", nouvType.icone);
    startTransition(async () => {
      const res = await creerType(fd);
      if (res.erreur) return notif(false, res.erreur);
      setNouvType(FORM_VIDE);
      notif(true, res.succes ?? "OK");
      rafraichir();
    });
  }

  function enregistrerType(t: TypeProduit) {
    const e = editType[t.id];
    if (!e) return;
    const fd = new FormData();
    fd.set("nom", e.nom);
    fd.set("ordre", e.ordre || "0");
    fd.set("icone", e.icone);
    startTransition(async () => {
      const res = await mettreAJourType(t.id, fd);
      if (res.erreur) return notif(false, res.erreur);
      setEditType((s) => {
        const n = { ...s };
        delete n[t.id];
        return n;
      });
      notif(true, res.succes ?? "OK");
      rafraichir();
    });
  }

  function effacerType(t: TypeProduit) {
    if (
      !confirm(
        `Supprimer le type « ${t.nom} » ? Ses sous-types seront aussi supprimés.`,
      )
    )
      return;
    startTransition(async () => {
      try {
        await supprimerType(t.id);
        notif(true, "Type supprimé.");
        rafraichir();
      } catch (e) {
        notif(false, e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function ajouterSousType(t: TypeProduit) {
    const v = nouvSousType[t.id] ?? FORM_VIDE;
    if (!v.nom.trim()) return;
    const fd = new FormData();
    fd.set("type_id", t.id);
    fd.set("nom", v.nom.trim());
    fd.set("ordre", v.ordre || "0");
    fd.set("icone", v.icone);
    startTransition(async () => {
      const res = await creerSousType(fd);
      if (res.erreur) return notif(false, res.erreur);
      setNouvSousType((s) => ({ ...s, [t.id]: FORM_VIDE }));
      notif(true, res.succes ?? "OK");
      rafraichir();
    });
  }

  function enregistrerSousType(st: SousTypeProduit) {
    const e = editSousType[st.id];
    if (!e) return;
    const fd = new FormData();
    fd.set("type_id", st.type_id);
    fd.set("nom", e.nom);
    fd.set("ordre", e.ordre || "0");
    fd.set("icone", e.icone);
    startTransition(async () => {
      const res = await mettreAJourSousType(st.id, fd);
      if (res.erreur) return notif(false, res.erreur);
      setEditSousType((s) => {
        const n = { ...s };
        delete n[st.id];
        return n;
      });
      notif(true, res.succes ?? "OK");
      rafraichir();
    });
  }

  function effacerSousType(st: SousTypeProduit) {
    if (!confirm(`Supprimer le sous-type « ${st.nom} » ?`)) return;
    startTransition(async () => {
      try {
        await supprimerSousType(st.id);
        notif(true, "Sous-type supprimé.");
        rafraichir();
      } catch (e) {
        notif(false, e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-3 text-sm border ${
            message.type === "ok"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-secondaire/5 border-secondaire/30 text-secondaire"
          }`}
        >
          {message.txt}
        </div>
      )}

      {/* Ajouter un type */}
      <div className="bg-white shadow-elegance p-6">
        <h2 className="font-display text-xl mb-4">Ajouter un type</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="etiquette">Icône</label>
            <IconePicker
              valeur={nouvType.icone}
              onChange={(v) => setNouvType((s) => ({ ...s, icone: v }))}
            />
          </div>
          <div className="flex-1 min-w-[14rem]">
            <label className="etiquette">Nom du type</label>
            <input
              className="champ"
              placeholder="Maillot de bain"
              value={nouvType.nom}
              onChange={(e) =>
                setNouvType((s) => ({ ...s, nom: e.target.value }))
              }
            />
          </div>
          <div className="w-24">
            <label className="etiquette">Ordre</label>
            <input
              className="champ"
              type="number"
              min="0"
              value={nouvType.ordre}
              onChange={(e) =>
                setNouvType((s) => ({ ...s, ordre: e.target.value }))
              }
            />
          </div>
          <button
            type="button"
            disabled={pending || !nouvType.nom.trim()}
            onClick={ajouterType}
            className="btn-or disabled:opacity-50"
          >
            Ajouter le type
          </button>
        </div>
        <p className="mt-3 text-[11px] text-charbon/50">
          Astuce : choisissez une icône dans la palette pour l&apos;afficher
          dans la navigation.
        </p>
      </div>

      {types.length === 0 && (
        <div className="bg-white shadow-elegance p-10 text-center text-charbon/60 text-sm">
          Aucun type pour le moment. Créez-en un au-dessus.
        </div>
      )}

      {types.map((t) => {
        const e = editType[t.id];
        const enEdition = !!e;
        const sousList = sousTypes.filter((s) => s.type_id === t.id);
        const nouv = nouvSousType[t.id] ?? FORM_VIDE;
        return (
          <div key={t.id} className="bg-white shadow-elegance p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-charbon/10">
              {enEdition ? (
                <div className="flex flex-wrap items-end gap-3 flex-1">
                  <div>
                    <label className="etiquette">Icône</label>
                    <IconePicker
                      valeur={e.icone}
                      onChange={(v) =>
                        setEditType((s) => ({
                          ...s,
                          [t.id]: { ...s[t.id]!, icone: v },
                        }))
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-[14rem]">
                    <label className="etiquette">Nom</label>
                    <input
                      className="champ"
                      value={e.nom}
                      onChange={(ev) =>
                        setEditType((s) => ({
                          ...s,
                          [t.id]: { ...s[t.id]!, nom: ev.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="w-24">
                    <label className="etiquette">Ordre</label>
                    <input
                      className="champ"
                      type="number"
                      min="0"
                      value={e.ordre}
                      onChange={(ev) =>
                        setEditType((s) => ({
                          ...s,
                          [t.id]: { ...s[t.id]!, ordre: ev.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {t.icone && (
                    <span className="inline-flex items-center justify-center w-10 h-10 border border-charbon/15 text-secondaire">
                      <IconeCategorie cle={t.icone} size={18} />
                    </span>
                  )}
                  <div>
                    <h3 className="font-display text-2xl">{t.nom}</h3>
                    <p className="text-[10px] tracking-luxe uppercase text-charbon/45 mt-0.5">
                      /{t.slug} · ordre {t.ordre}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                {enEdition ? (
                  <>
                    <button
                      className="btn-or"
                      disabled={pending}
                      onClick={() => enregistrerType(t)}
                    >
                      Enregistrer
                    </button>
                    <button
                      className="btn-contour"
                      onClick={() =>
                        setEditType((s) => {
                          const n = { ...s };
                          delete n[t.id];
                          return n;
                        })
                      }
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-contour"
                      onClick={() =>
                        setEditType((s) => ({
                          ...s,
                          [t.id]: {
                            nom: t.nom,
                            ordre: String(t.ordre),
                            icone: t.icone ?? "",
                          },
                        }))
                      }
                    >
                      Modifier
                    </button>
                    <button
                      className="text-xs tracking-luxe uppercase text-secondaire hover:underline px-3"
                      disabled={pending}
                      onClick={() => effacerType(t)}
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4">
              <p className="text-[10px] tracking-luxe uppercase text-charbon/55 mb-3">
                Sous-types
              </p>
              {sousList.length === 0 && (
                <p className="text-sm text-charbon/50 mb-3">
                  Aucun sous-type pour ce type.
                </p>
              )}

              <ul className="space-y-2 mb-4">
                {sousList.map((st) => {
                  const es = editSousType[st.id];
                  return (
                    <li
                      key={st.id}
                      className="flex flex-wrap items-end gap-3 p-3 bg-fond-douce/40 border border-charbon/5"
                    >
                      {es ? (
                        <>
                          <div>
                            <label className="etiquette">Icône</label>
                            <IconePicker
                              taille="sm"
                              valeur={es.icone}
                              onChange={(v) =>
                                setEditSousType((s) => ({
                                  ...s,
                                  [st.id]: { ...s[st.id]!, icone: v },
                                }))
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-[12rem]">
                            <label className="etiquette">Nom</label>
                            <input
                              className="champ"
                              value={es.nom}
                              onChange={(ev) =>
                                setEditSousType((s) => ({
                                  ...s,
                                  [st.id]: {
                                    ...s[st.id]!,
                                    nom: ev.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                          <div className="w-20">
                            <label className="etiquette">Ordre</label>
                            <input
                              className="champ"
                              type="number"
                              min="0"
                              value={es.ordre}
                              onChange={(ev) =>
                                setEditSousType((s) => ({
                                  ...s,
                                  [st.id]: {
                                    ...s[st.id]!,
                                    ordre: ev.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                          <button
                            className="btn-or"
                            disabled={pending}
                            onClick={() => enregistrerSousType(st)}
                          >
                            OK
                          </button>
                          <button
                            className="btn-contour"
                            onClick={() =>
                              setEditSousType((s) => {
                                const n = { ...s };
                                delete n[st.id];
                                return n;
                              })
                            }
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1 flex items-center gap-3">
                            {st.icone && (
                              <span className="inline-flex items-center justify-center w-8 h-8 border border-charbon/15 text-secondaire">
                                <IconeCategorie cle={st.icone} size={14} />
                              </span>
                            )}
                            <div>
                              <p className="text-sm text-charbon">{st.nom}</p>
                              <p className="text-[10px] tracking-luxe uppercase text-charbon/40">
                                /{st.slug} · ordre {st.ordre}
                              </p>
                            </div>
                          </div>
                          <button
                            className="btn-contour"
                            onClick={() =>
                              setEditSousType((s) => ({
                                ...s,
                                [st.id]: {
                                  nom: st.nom,
                                  ordre: String(st.ordre),
                                  icone: st.icone ?? "",
                                },
                              }))
                            }
                          >
                            Modifier
                          </button>
                          <button
                            className="text-xs tracking-luxe uppercase text-secondaire hover:underline px-2"
                            disabled={pending}
                            onClick={() => effacerSousType(st)}
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Ajouter sous-type */}
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="etiquette">Icône</label>
                  <IconePicker
                    taille="sm"
                    valeur={nouv.icone}
                    onChange={(v) =>
                      setNouvSousType((s) => ({
                        ...s,
                        [t.id]: { ...nouv, icone: v },
                      }))
                    }
                  />
                </div>
                <div className="flex-1 min-w-[12rem]">
                  <label className="etiquette">Nouveau sous-type</label>
                  <input
                    className="champ"
                    placeholder="Burkini"
                    value={nouv.nom}
                    onChange={(ev) =>
                      setNouvSousType((s) => ({
                        ...s,
                        [t.id]: { ...nouv, nom: ev.target.value },
                      }))
                    }
                  />
                </div>
                <div className="w-20">
                  <label className="etiquette">Ordre</label>
                  <input
                    className="champ"
                    type="number"
                    min="0"
                    value={nouv.ordre}
                    onChange={(ev) =>
                      setNouvSousType((s) => ({
                        ...s,
                        [t.id]: { ...nouv, ordre: ev.target.value },
                      }))
                    }
                  />
                </div>
                <button
                  className="btn-contour"
                  disabled={pending || !nouv.nom.trim()}
                  onClick={() => ajouterSousType(t)}
                >
                  Ajouter sous-type
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
