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

# Arguments de build pour l'URL de l'API
ARG VITE_API_URL=http://localhost:8080/api
ENV VITE_API_URL=$VITE_API_URL

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
