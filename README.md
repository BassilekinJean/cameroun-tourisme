# 🇨🇲 CamerTrip - Plateforme Touristique du Cameroun

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-purple.svg)](https://vitejs.dev/)

CamerTrip est une plateforme de tourisme dédiée à la découverte des richesses du Cameroun. Elle permet aux voyageurs de rechercher des établissements (hôtels, restaurants, activités, destinations), de consulter et publier des avis, et de planifier leurs voyages.

## 📁 Structure du Projet

```
cameroun-tourisme/
├── client/                 # Application Frontend React
│   ├── src/
│   │   ├── api/           # Services d'appel API
│   │   │   ├── config.ts          # Configuration Axios
│   │   │   ├── types.ts           # Types TypeScript
│   │   │   ├── authService.ts     # Authentification
│   │   │   ├── userService.ts     # Gestion profil utilisateur
│   │   │   ├── etablissementService.ts # Établissements
│   │   │   └── avisService.ts     # Avis
│   │   ├── components/    # Composants React
│   │   └── styles/        # Fichiers CSS
│   ├── package.json
│   └── vite.config.js
│
└── server/                 # Application Backend Spring Boot
    ├── src/main/java/com/cameroun_tour/tourisme/
    │   ├── voyageur/      # Module Voyageur (authentification)
    │   ├── etablissement/ # Module Établissement
    │   ├── Avis/          # Module Avis
    │   ├── media/         # Module Médias (images)
    │   └── common/        # Composants partagés
    ├── src/main/resources/
    │   ├── application.properties
    │   └── application-*.properties
    └── pom.xml
```

## 🚀 Technologies

### Backend
- **Spring Boot 3.x** - Framework Java
- **Spring Modulith** - Architecture modulaire
- **Spring Security** - Authentification JWT avec HttpOnly cookies
- **Spring Data JPA** - Accès aux données
- **Spring HATEOAS** - API hypermedia
- **Redis** - Cache et stockage OTP
- **PostgreSQL/H2** - Base de données

### Frontend
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite 7** - Build tool
- **TailwindCSS 4** - Framework CSS
- **Axios** - Client HTTP
- **Lucide React** - Icônes

## 📋 Fonctionnalités

### Authentification
- ✅ Inscription avec email
- ✅ Connexion avec email/mot de passe
- ✅ JWT stocké dans HttpOnly cookies (sécurisé)
- ✅ Refresh token automatique
- ✅ Déconnexion

### Voyageurs
- ✅ Profil utilisateur
- ✅ Modification des informations personnelles
- ✅ Gestion des favoris
- ✅ Historique des avis

### Établissements
- ✅ Liste des établissements par catégorie
- ✅ Recherche textuelle
- ✅ Filtrage par ville
- ✅ Détails d'un établissement
- ✅ Galerie d'images

### Avis
- ✅ Liste des avis par établissement
- ✅ Publication d'un avis (note + commentaire)
- ✅ Like/Unlike d'un avis

### Médias
- ✅ Upload d'images
- ✅ Téléchargement d'images
- ✅ Association aux établissements

## 🛠️ Installation

### Prérequis
- Java 17+
- Node.js 18+
- Maven 3.8+
- Redis (optionnel, pour la production)

### Backend

```bash
# Naviguer vers le dossier serveur
cd server

# Installer les dépendances et compiler
./mvnw clean install -DskipTests

# Lancer l'application (profil dev)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Le serveur démarre sur `http://localhost:8080`

### Frontend

```bash
# Naviguer vers le dossier client
cd client

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application démarre sur `http://localhost:5173`

## 🔗 API Endpoints

### Authentification (`/api/auth`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Inscription d'un nouvel utilisateur |
| POST | `/login` | Connexion |
| POST | `/logout` | Déconnexion |
| POST | `/refresh-token` | Rafraîchir le token JWT |
| GET | `/me` | Obtenir l'utilisateur connecté |

### Voyageurs (`/api/voyageurs`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/me` | Profil de l'utilisateur connecté |
| PUT | `/me` | Mettre à jour le profil |
| POST | `/favoris/{etablissementId}` | Ajouter/Retirer des favoris |

### Établissements (`/api/lieux`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste paginée des établissements |
| GET | `/{publicId}` | Détails d'un établissement |
| GET | `/search?q=` | Recherche textuelle |
| GET | `/categorie/{categorie}` | Filtrer par catégorie |
| GET | `/ville/{ville}` | Filtrer par ville |
| POST | `/register` | Créer un établissement (propriétaire) |

### Avis (`/api/avis`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/etablissement/{publicId}` | Avis d'un établissement |
| POST | `/` | Créer un avis |
| POST | `/{avisId}/like` | Liker/Unliker un avis |

### Médias (`/api/media`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/upload` | Uploader une image |
| GET | `/images/{filename}` | Télécharger une image |
| GET | `/etablissement/{etablissementId}` | Images d'un établissement |

### Administration (`/api/admin`) 🔐

> ⚠️ Tous les endpoints nécessitent le rôle `ADMIN`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/stats` | Statistiques globales du dashboard |
| GET | `/users` | Liste paginée des utilisateurs |
| GET | `/users/{publicId}` | Détails d'un utilisateur |
| PUT | `/users/{publicId}` | Modifier un utilisateur |
| PUT | `/users/{publicId}/role` | Modifier le rôle d'un utilisateur |
| PUT | `/users/{publicId}/toggle-lock` | Verrouiller/Déverrouiller un compte |
| DELETE | `/users/{publicId}` | Supprimer un utilisateur |
| DELETE | `/users/batch` | Supprimer plusieurs utilisateurs |
| GET | `/etablissements` | Liste paginée des établissements |
| POST | `/etablissements` | Créer un établissement |
| PUT | `/etablissements/{publicId}` | Modifier un établissement |
| DELETE | `/etablissements/{publicId}` | Supprimer un établissement |
| GET | `/avis` | Liste paginée des avis |
| DELETE | `/avis/{publicId}` | Supprimer un avis |
| DELETE | `/avis/batch` | Supprimer plusieurs avis |

## 🏗️ Architecture

### Backend - Spring Modulith

Le backend utilise une architecture modulaire avec Spring Modulith :

```
com.cameroun_tour.tourisme/
├── voyageur/           # Gestion des voyageurs et authentification
├── etablissement/      # Gestion des établissements
├── Avis/              # Gestion des avis
├── media/             # Gestion des médias
├── admin/             # Panel d'administration (ADMIN uniquement)
└── common/            # Composants partagés (DTOs, exceptions, contracts)
```

Chaque module est indépendant avec :
- **Domain** : Entités JPA
- **Repository** : Accès aux données
- **Service** : Logique métier
- **Controller** : API REST

### Frontend - React

Le frontend utilise une architecture composants :

```
src/
├── api/              # Services API (Axios)
│   ├── adminService.ts          # API admin (gestion utilisateurs, établissements, avis)
│   └── etablissementPanelService.ts  # API panel propriétaire
├── components/       # Composants React
│   ├── ui/          # Composants UI réutilisables (shadcn)
│   ├── figma/       # Composants design system
│   ├── AdminDashboard.tsx       # Dashboard administrateur
│   ├── UserManagement.tsx       # Gestion des utilisateurs
│   ├── EtablissementManagement.tsx  # Gestion des établissements
│   ├── AvisManagement.tsx       # Gestion des avis
│   └── EtablissementPanel.tsx   # Panel propriétaire
└── styles/          # CSS global
```

## 🔐 Sécurité

### Rôles et Permissions

L'application utilise trois rôles avec des permissions différentes :

| Rôle | Description | Accès |
|------|-------------|-------|
| `USER` | Utilisateur standard | Consultation, avis, favoris |
| `ETABLISSEMENT` | Propriétaire d'établissement | + Gestion de ses établissements |
| `ADMIN` | Administrateur | + Panel admin complet |

### Panel Administrateur (ADMIN)

Le panel admin permet de :
- 📊 Voir les statistiques globales (utilisateurs, établissements, avis)
- 👥 Gérer les utilisateurs (modifier, verrouiller, supprimer, changer le rôle)
- 🏨 Gérer les établissements (créer, modifier, supprimer)
- ⭐ Modérer les avis (supprimer les avis inappropriés)

**Accès :** Cliquer sur l'icône 🛡️ (bouclier) dans le header après connexion avec un compte ADMIN.

### Panel Établissement (ETABLISSEMENT)

Le panel établissement permet aux propriétaires de :
- 📋 Voir leurs établissements
- ✏️ Modifier les informations
- 📸 Gérer les photos
- 💬 Répondre aux avis

**Accès :** Cliquer sur l'icône 🏢 (bâtiment) dans le header après connexion avec un compte ETABLISSEMENT.

### JWT avec HttpOnly Cookies

L'authentification utilise des JWT stockés dans des cookies HttpOnly :

- **Access Token** : Durée de vie courte (15-30 min)
- **Refresh Token** : Durée de vie longue (7 jours)
- **HttpOnly** : Protège contre les attaques XSS
- **Secure** : HTTPS uniquement en production
- **SameSite** : Protection CSRF

### Endpoints Publics

Les endpoints suivants sont accessibles sans authentification :
- `GET /api/lieux/**` - Consultation des établissements
- `GET /api/avis/**` - Consultation des avis
- `GET /api/media/images/**` - Téléchargement d'images
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

## 📊 Modèle de Données

### Entités Principales

```
Voyageur
├── id (Long, interne)
├── publicId (UUID, externe)
├── nomComplet (String)
├── email (String, unique)
├── password (String, hashé)
├── paysOrigine (String)
├── photoProfile (String)
└── role (USER, ETABLISSEMENT, ADMIN)

Etablissement
├── id (Long, interne)
├── publicId (UUID, externe)
├── nom (String)
├── description (String)
├── categorie (HOTEL, RESTAURANT, ACTIVITE, DESTINATION)
├── ville (String)
├── adresse (String)
├── telephone (String)
├── email (String)
├── prixMoyen (Double)
├── noteMoyenne (Double)
└── commodites (List<String>)

Avis
├── id (Long, interne)
├── publicId (UUID, externe)
├── note (Integer, 1-5)
├── commentaire (String)
├── dateCreation (LocalDateTime)
├── nombreLikes (Integer)
├── voyageur (Voyageur)
└── etablissement (Etablissement)
```

## 🧪 Tests

### Backend

```bash
cd server
./mvnw test
```

### Frontend

```bash
cd client
npm run test
```

## 🚀 Déploiement

### Variables d'environnement

```env
# Backend
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://host:5432/camertrip
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend
VITE_API_URL=https://api.camertrip.cm
```

### Docker

```bash
# Build et run avec Docker Compose
docker-compose up -d
```

## 📝 Conventions

### Code Style

- **Backend** : Google Java Style Guide
- **Frontend** : Prettier + ESLint

### Commits

Format : `type(scope): message`

Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Exemple : `feat(auth): ajouter la vérification OTP`

### Branches

- `main` - Production
- `develop` - Développement
- `feature/*` - Nouvelles fonctionnalités
- `fix/*` - Corrections de bugs

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commit (`git commit -m 'feat: ajouter ma fonctionnalité'`)
4. Push (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Développeur** - Bassilekin jean simonet + contributeurs

## 📧 Contact

Pour toute question : bassilekinjean@outlook.com

---

Fait avec ❤️ pour le Cameroun 🇨🇲
