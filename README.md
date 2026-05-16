# Aura Nuit

Site e-commerce de luxe en Next.js (App Router), Tailwind CSS, Supabase et UploadThing. Interface entièrement en français.

## Stack

- **Next.js 14** (App Router, Server Actions)
- **TypeScript**
- **Tailwind CSS** (palette personnalisée : Dusty Pink / Rose Gold / Marble / Gold / Deep Charcoal)
- **Supabase** (PostgreSQL + auth service-role côté serveur)
- **UploadThing** (upload et gestion d'images)
- **Polices** : Playfair Display (titres) + Inter (corps)

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement et le remplir
cp .env.example .env.local
# (puis éditer .env.local avec vos clés)

# 3. Créer les tables Supabase
# Ouvrir le SQL Editor de Supabase et exécuter supabase/schema.sql

# 4. Démarrer en développement
npm run dev
```

Le site sera disponible sur [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Voir `.env.example`. Variables requises :

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon (publique) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service-role (privée — jamais exposée au client) |
| `ADMIN_PASSWORD` | Mot de passe pour accéder à `/admin` |
| `ADMIN_SESSION_SECRET` | Secret de signature du cookie session (≥32 caractères aléatoires) |
| `UPLOADTHING_TOKEN` | Token UploadThing |
| `UPLOADTHING_SECRET` | Secret UploadThing |

## Structure

```
src/
  app/
    page.tsx                 — Accueil (hero marbre)
    boutique/                — Catalogue produits + détail
    commande/                — Tunnel d'achat sans compte
    admin/                   — Tableau de bord protégé
    api/uploadthing/         — Route handler UploadThing
  actions/                   — Server Actions (produits, commandes, auth)
  components/                — Composants UI
  lib/
    supabase/                — Clients Supabase (browser, server, service-role)
    auth.ts                  — Helpers session admin
    utils.ts                 — Utilitaires (formatage prix, etc.)
  types/database.ts          — Types des tables
middleware.ts                — Protection des routes /admin
supabase/schema.sql          — Schéma SQL à exécuter dans Supabase
```

## Tableau de bord administrateur

- URL : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Mot de passe : valeur de `ADMIN_PASSWORD` dans `.env.local`
- Fonctionnalités :
  - CRUD complet des produits
  - Upload multiple d'images via UploadThing
  - Calcul automatique du profit par article (`prix_vente − prix_achat`)
  - Liste des commandes avec mise à jour du statut en un clic

## Conformité visuelle

Le site est conçu pour n'afficher que des visuels de type **Ghost Mannequin** ou **Flat Lay**. Les uploads doivent respecter ce standard.

## Scripts

```bash
npm run dev         # Serveur de développement
npm run build       # Build de production
npm run start       # Démarrer le build de production
npm run lint        # ESLint
npm run typecheck   # Vérification TypeScript
```

## Sécurité

- Routes `/admin/**` protégées par `middleware.ts` (cookie signé HMAC-SHA256).
- Toutes les mutations passent par des Server Actions utilisant la clé service-role.
- La clé service-role n'est **jamais** importée dans du code client.
