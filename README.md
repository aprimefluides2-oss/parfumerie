# Maison Élixir · Haute Parfumerie

Site vitrine React + Vite avec back-office `/admin` (gestion des parfums, prix, notes de layering, images).

## Dev local

```
npm install
npm run dev
```

- Site public : http://localhost:3000
- Back-office : http://localhost:3000/admin (mot de passe par défaut : `admin`)

En local les données sont stockées dans `data/perfumes.json` et `data/layering.json`, les images uploadées dans `public/uploads/`.

## Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `ADMIN_PASSWORD` | Mot de passe du back-office | `admin` |
| `GEMINI_API_KEY` | Clé Google Gemini pour le conseiller olfactif IA | (mode simulation si absent) |

## Déploiement Vercel

Le projet est compatible Vercel (rewrites + Vercel Functions dans `api/`). Pour que le back-office persiste les données et accepte les uploads d'images, il faut activer deux services Vercel :

### 1. Vercel KV (données parfums/notes)

Dashboard Vercel → **Storage** → **Create Database** → **KV** → nom au choix → **Connect to project**.

Les variables `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `KV_URL` sont injectées automatiquement.

### 2. Vercel Blob (uploads d'images)

Dashboard Vercel → **Storage** → **Create Database** → **Blob** → nom au choix → **Connect to project**.

La variable `BLOB_READ_WRITE_TOKEN` est injectée automatiquement.

### 3. Variables manuelles

Dans **Settings → Environment Variables**, ajouter :

- `ADMIN_PASSWORD` — mot de passe du back-office (choisis-le bien)
- `GEMINI_API_KEY` — optionnel, pour activer le vrai conseiller IA

Redéploie après chaque changement de variable.

### Initialisation des données sur Vercel

À la première requête `GET /api/perfumes` sur Vercel, le KV est seedé avec le contenu de `data/perfumes.json` (idem pour `data/layering.json`). Tes modifications via le back-office écrasent ensuite ces données dans le KV.

## Structure

```
api/                  Vercel Functions (utilisées en prod)
  _lib/               storage (KV↔JSON), auth, upload (Blob↔fichier)
  perfumes/           GET/POST + [id].ts (PUT/DELETE)
  layering/           GET/POST + [id].ts (PUT/DELETE)
  admin/              login.ts, upload.ts
  conseiller.ts       IA Gemini
data/                 seed JSON (parfums + notes layering)
public/images/        photos des parfums (servies statiquement)
public/uploads/       images uploadées via admin (dev local seulement)
src/                  app React publique
  admin/              app React du back-office
server.ts             dev local : Vite middleware + wrappers Express vers api/*
```
