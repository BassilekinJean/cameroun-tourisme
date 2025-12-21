# 🌍 CamerTrip - Frontend

Application frontend React pour CamerTrip, la plateforme de tourisme au Cameroun.

## 🚀 Technologies

- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool & dev server
- **TailwindCSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI
- **Lucide React** - Icônes
- **Axios** - Client HTTP

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Installation locale

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour la production
npm run build

# Preview du build
npm run preview
```

### Variables d'environnement

Créez un fichier `.env.local` :

```env
VITE_API_URL=http://localhost:8080/api
```

## 📁 Structure du projet

```
src/
├── api/                        # Services API
│   ├── config.ts              # Configuration Axios
│   ├── authService.ts         # Authentification
│   ├── etablissementService.ts # Établissements
│   ├── avisService.ts         # Avis
│   ├── userService.ts         # Profil utilisateur
│   ├── adminService.ts        # 🔐 API Administration
│   └── etablissementPanelService.ts  # 🏢 API Panel Établissement
│
├── components/                 # Composants React
│   ├── ui/                    # Composants UI (shadcn)
│   ├── figma/                 # Design system
│   │
│   ├── Header.tsx             # Navigation principale
│   ├── Hero.tsx               # Section héro
│   ├── DestinationsGrid.tsx   # Grille de destinations
│   ├── HotelsSection.tsx      # Section hôtels
│   ├── ActivitiesSection.tsx  # Section activités
│   ├── DetailsPage.tsx        # Page détail établissement
│   ├── SearchResultsPage.tsx  # Résultats de recherche
│   │
│   ├── AuthModal.tsx          # Modal connexion/inscription
│   ├── UserProfilePage.tsx    # Profil utilisateur
│   │
│   ├── AdminDashboard.tsx     # 🔐 Dashboard admin
│   ├── UserManagement.tsx     # 🔐 Gestion utilisateurs
│   ├── EtablissementManagement.tsx  # 🔐 Gestion établissements
│   ├── AvisManagement.tsx     # 🔐 Gestion avis
│   │
│   └── EtablissementPanel.tsx # 🏢 Panel propriétaire
│
├── styles/
│   └── globals.css            # Styles globaux
│
├── App.tsx                    # Composant principal & routage
├── main.jsx                   # Point d'entrée
└── index.css                  # TailwindCSS
```

## 🔐 Panels d'Administration

### Panel Administrateur (ADMIN)

Accessible via l'icône 🛡️ dans le header pour les utilisateurs avec le rôle `ADMIN`.

**Fonctionnalités :**

- **Dashboard** : Vue d'ensemble avec statistiques
  - Nombre total d'utilisateurs
  - Nombre d'établissements par catégorie
  - Nombre total d'avis
  
- **Gestion des utilisateurs**
  - Recherche et filtrage
  - Modification des informations
  - Changement de rôle (USER, ETABLISSEMENT, ADMIN)
  - Verrouillage/Déverrouillage de compte
  - Suppression individuelle ou en lot
  
- **Gestion des établissements**
  - Création de nouveaux établissements
  - Modification des informations
  - Suppression
  
- **Modération des avis**
  - Visualisation de tous les avis
  - Suppression des avis inappropriés
  - Suppression en lot

### Panel Établissement (ETABLISSEMENT)

Accessible via l'icône 🏢 dans le header pour les utilisateurs avec le rôle `ETABLISSEMENT`.

**Fonctionnalités :**

- Visualisation des établissements du propriétaire
- Modification des informations
- Gestion des photos
- Consultation des avis reçus

## 🎨 Composants UI

Les composants UI sont basés sur **shadcn/ui** et se trouvent dans `src/components/ui/` :

- `Button` - Boutons stylisés
- `Card` - Cartes de contenu
- `Input` - Champs de saisie
- `Modal/Dialog` - Fenêtres modales
- `Table` - Tableaux de données
- `Badge` - Badges et tags
- `Avatar` - Avatars utilisateurs
- Et plus...

## 🔄 API Services

### Configuration

Tous les services utilisent une instance Axios configurée avec :
- Base URL depuis les variables d'environnement
- Intercepteur pour le refresh token automatique
- Credentials inclus (cookies HttpOnly)

### Services disponibles

| Service | Description |
|---------|-------------|
| `authService` | Connexion, inscription, déconnexion, refresh token |
| `etablissementService` | CRUD établissements, recherche, filtrage |
| `avisService` | CRUD avis, likes |
| `userService` | Profil, favoris |
| `adminService` | API admin (stats, users, établissements, avis) |
| `etablissementPanelService` | API panel propriétaire |

## 🧪 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run preview  # Preview du build
npm run lint     # ESLint
```

## 📝 Notes de développement

### Authentification

L'authentification utilise des cookies HttpOnly :
- Pas de stockage de tokens dans localStorage/sessionStorage
- Refresh automatique des tokens expirés
- Déconnexion qui invalide les cookies côté serveur

### Navigation conditionnelle

Le header affiche des icônes différentes selon le rôle :
- 🛡️ Shield : Visible pour ADMIN → accès au panel admin
- 🏢 Building2 : Visible pour ETABLISSEMENT → accès au panel établissement

### État global

L'état de l'utilisateur est géré dans `App.tsx` et passé aux composants via props :
- `user` : Informations de l'utilisateur connecté
- `isAuthenticated` : État de connexion

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit avec des messages conventionnels
4. Ouvrir une Pull Request

## 📄 Licence

MIT - Voir le fichier LICENSE à la racine du projet

## ⚡ Supabase Configuration (Nouveau)

L'application utilise désormais **Supabase Storage** pour gérer l'upload des images (photos de profil, images d'établissements).

### Prérequis

1. Créer un projet Supabase.
2. Créer deux buckets de stockage publics :
    - `utilisateur_image`
    - `etablissement_image`
3. Configurer les politiques d'accès (Policies) pour permettre :
    - Lecture publique (`SELECT`) pour tout le monde.
    - Upload (`INSERT`) pour les utilisateurs authentifiés (ou tout le monde si test).

### Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` (à la racine du dossier `client`) :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_publique
```
