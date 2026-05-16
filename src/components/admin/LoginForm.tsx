"use client";

import { useFormState, useFormStatus } from "react-dom";
import { connecterAdmin, type EtatConnexion } from "@/actions/auth";

const initial: EtatConnexion = {};

function Bouton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-or w-full disabled:opacity-50">
      {pending ? "Connexion…" : "Se connecter"}
    </button>
  );
}

export function LoginForm({ redirect }: { redirect: string }) {
  const [etat, action] = useFormState(connecterAdmin, initial);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="redirect" value={redirect} />
      <div>
        <label htmlFor="mot_de_passe" className="etiquette">
          Mot de passe
        </label>
        <input
          id="mot_de_passe"
          name="mot_de_passe"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="champ"
          placeholder="••••••••"
        />
      </div>

      {etat.erreur && (
        <p className="text-sm text-secondaire bg-secondaire/5 p-3 border border-secondaire/20">
          {etat.erreur}
        </p>
      )}

      <Bouton />
    </form>
  );
}
