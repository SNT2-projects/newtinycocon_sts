# Étape 1 : Utiliser une image Node.js officielle comme base
FROM node:18-alpine

# Étape 2 : Créer un répertoire pour l'application
WORKDIR /app

# Étape 3 : Copier les fichiers de package et installer les dépendances
COPY package*.json ./

# Étape 4 : Installer toutes les dépendances, y compris les dépendances de développement
RUN npm install

# Étape 5 : Copier le reste des fichiers de l'application
COPY . .

# Étape 6 : Installer curl
RUN apk add curl

# Étape 6.5 : S'assurer que les dossiers existent et que les fichiers sont copiés
RUN mkdir -p .svelte-kit/static/export && \
    cp -r static/export/* .svelte-kit/static/export/

# Étape 7 : Construire l'application Svelte avec les avertissements désactivés
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build:docker

# Étape 8 : Exposer le port utilisé par l'application (par défaut 3000)
EXPOSE 3000

# Set environment variables for the server
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Étape 9 : Commande pour démarrer l'application
CMD ["node", "build/index.js"]