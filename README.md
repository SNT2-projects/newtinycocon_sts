# TinyCocon STS

Outil de rédaction de cocons multilingues avec génération automatique de HTML et sitemaps XML.

## Fonctionnalités

- **Gestion multilingue** : Support des articles en plusieurs langues (FR, EN, DE, ES, IT, NL)
- **Génération de cocons** : Organisation automatique des articles par thématiques
- **Export HTML** : Génération de fichiers HTML optimisés pour le référencement
- **Sitemaps XML** : Génération automatique de sitemaps pour chaque cocon et langue
- **Images intégrées** : Téléchargement et intégration automatique des images
- **Balises hreflang** : Génération automatique des balises multilingues

## Structure des exports

Lors de la compilation, l'outil génère la structure suivante :

```
exports/export-DD-MM-YYYY_HH-MM-SS/
├── fr/
│   └── guides/
│       ├── sitemap.xml                    # Sitemap global français
│       └── nom-du-cocon/
│           ├── sitemap.xml                # Sitemap du cocon
│           ├── article-1.html
│           ├── article-2.html
│           └── images/
│               └── image.jpg
├── en/
│   └── guides/
│       ├── sitemap.xml                    # Sitemap global anglais
│       └── cocon-name/
│           ├── sitemap.xml                # Sitemap du cocon
│           ├── article-1.html
│           └── article-2.html
└── de/
    └── fuehrungen/                        # Nom traduit selon la langue
        └── ...
```

## Sitemaps XML

L'outil génère automatiquement deux types de sitemaps :

### 1. Sitemaps par cocon
- **Emplacement** : `{langue}/{guidesDir}/{cocon-slug}/sitemap.xml`
- **Contenu** : Liste de tous les articles du cocon dans cette langue
- **Métadonnées** : `lastmod`, `changefreq`, `priority`

### 2. Sitemaps index par langue
- **Emplacement** : `{langue}/{guidesDir}/sitemap.xml`
- **Contenu** : Référence tous les sitemaps des cocons de cette langue
- **Mise à jour** : Date la plus récente parmi tous les cocons

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Configuration de l'API Directus
VITE_DIRECTUS_URL=https://back.tinycocon.snt2.tech

# URL de production pour les liens canoniques, hreflang et sitemaps
PRODUCTION_URL=https://studiosport.fr
```

### Traductions des dossiers guides

L'outil traduit automatiquement le nom du dossier "guides" selon la langue :
- `fr` → `guides`
- `en` → `guides`
- `de` → `fuehrungen`
- `es` → `guias`
- `it` → `guide`
- `nl` → `gidsen`

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Compilation

```bash
npm run build
```

## Utilisation

1. **Compilation des cocons** : Utilisez l'interface web pour lancer la compilation
2. **Progression en temps réel** : Suivez l'avancement de la génération
3. **Export automatique** : Les fichiers HTML et sitemaps sont générés automatiquement
4. **Téléchargement** : Récupérez l'archive ZIP générée

## Structure technique

- **Framework** : SvelteKit + TypeScript
- **API** : Directus pour la gestion de contenu
- **Build** : Vite
- **Styling** : TailwindCSS
- **Export** : Génération de fichiers statiques HTML + XML

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
