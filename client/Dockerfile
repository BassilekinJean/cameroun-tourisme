# ================================================================
# Dockerfile - Frontend React/Vite (Cameroun Tourisme)
# Multi-stage build avec Nginx pour servir les fichiers statiques
# ================================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Arguments de build (doivent correspondre aux ARGs passés par docker build)
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

# Définir comme variables d'environnement pour le build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=$VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

# Build de l'application
RUN npm run build

# Stage 2: Nginx pour servir les fichiers statiques
FROM nginx:alpine AS runtime

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis le stage de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
