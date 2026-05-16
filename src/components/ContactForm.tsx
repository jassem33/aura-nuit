"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  envoyerMessageContact,
  type EtatContact,
} from "@/actions/contact";

const etatInitial: EtatContact = {};

function BoutonEnvoyer() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-or px-5 py-2 text-xs disabled:opacity-60 disabled:cursor-wait"
    >
      {pending ? "Envoi en cours…" : "Envoyer le message"}
    </button>
  );
}

export function ContactForm() {
  const [etat, action] = useFormState(envoyerMessageContact, etatInitial);

  return (
    <form action={action} className="space-y-4">
      {etat.succes && (
        <p className="bg-secondaire/10 border border-secondaire/30 text-secondaire text-xs px-3 py-2.5">
          {etat.succes}
        </p>
      )}
      {etat.erreur && (
        <p className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5">
          {etat.erreur}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="etiquette text-[9px]" htmlFor="nom">
            Nom complet *
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            placeholder="Votre nom"
            className="champ text-sm py-2"
          />
          {etat.champErreurs?.nom && (
            <p className="text-[11px] text-red-600 mt-1">{etat.champErreurs.nom}</p>
          )}
        </div>
        <div>
          <label className="etiquette text-[9px]" htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="votre@email.com"
            className="champ text-sm py-2"
          />
          {etat.champErreurs?.email && (
            <p className="text-[11px] text-red-600 mt-1">{etat.champErreurs.email}</p>
          )}
        </div>
      </div>

      <div>
        <label className="etiquette text-[9px]" htmlFor="sujet">
          Sujet
        </label>
        <input
          id="sujet"
          name="sujet"
          type="text"
          placeholder="Sujet de votre message"
          className="champ text-sm py-2"
        />
      </div>

      <div>
        <label className="etiquette text-[9px]" htmlFor="message">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Votre message…"
          className="champ text-sm py-2 resize-y"
        />
        {etat.champErreurs?.message && (
          <p className="text-[11px] text-red-600 mt-1">{etat.champErreurs.message}</p>
        )}
      </div>

      <div className="pt-1">
        <BoutonEnvoyer />
      </div>
    </form>
  );
}
