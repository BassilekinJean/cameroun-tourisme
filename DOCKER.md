# 🐳 Dockerisation - Cameroun Tourisme

Ce document explique comment déployer l'application Cameroun Tourisme avec Docker.

## 📋 Prérequis

- Docker Engine 20.10+
- Docker Compose v2.0+
- Au moins 4 GB de RAM disponible

## 🚀 Démarrage rapide

### 1. Configuration

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer les variables selon vos besoins
nano .env
```

### 2. Lancement

```bash
# Construire et démarrer tous les services
docker compose up -d --build

# Ou utiliser le Makefile
make up
```

### 3. Accès aux services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Application React |
| Backend API | http://localhost:8080 | API Spring Boot |
| Swagger UI | http://localhost:8080/swagger-ui.html | Documentation API |
| MailHog | http://localhost:8025 | Interface emails de test |
| MySQL | localhost:3307 | Base de données |
| Redis | localhost:6380 | Cache |

## 📦 Services Docker

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Frontend │  │ Backend  │  │  MySQL   │  │  Redis   │    │
│  │  (Nginx) │──│ (Spring) │──│   8.0    │  │    7     │    │
│  │   :80    │  │  :8080   │  │  :3306   │  │  :6379   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                      │                                       │
│                ┌──────────┐                                  │
│                │ MailHog  │                                  │
│                │  :1025   │                                  │
│                └──────────┘                                  │
└─────────────────────────────────────────────────────────────┘
         │              │              │             │
    localhost:3000  localhost:8080  localhost:3307  localhost:6380
```

## 🛠️ Commandes utiles

### Gestion des conteneurs

```bash
# Démarrer les services
docker compose up -d

# Arrêter les services
docker compose down

# Voir les logs
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f backend

# Reconstruire les images
docker compose up -d --build

# Supprimer les volumes (⚠️ perte de données)
docker compose down -v
```

### Accès aux conteneurs

```bash
# Shell MySQL
docker exec -it cameroun-tour-mysql mysql -u cameroun_user -p cameroun_tour

# Shell Redis
docker exec -it cameroun-tour-redis redis-cli

# Shell Backend
docker exec -it cameroun-tour-backend sh
```

### Base de données

```bash
# Import manuel des données
docker exec -i cameroun-tour-mysql mysql -u cameroun_user -pcameroun_password cameroun_tour < ./server/src/main/resources/data-etablissements.sql

# Export de la base
docker exec cameroun-tour-mysql mysqldump -u cameroun_user -pcameroun_password cameroun_tour > backup.sql
```

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `MYSQL_ROOT_PASSWORD` | Mot de passe root MySQL | rootpassword |
| `MYSQL_DATABASE` | Nom de la base de données | cameroun_tour |
| `MYSQL_USER` | Utilisateur MySQL | cameroun_user |
| `MYSQL_PASSWORD` | Mot de passe utilisateur | cameroun_password |
| `JWT_SECRET_KEY` | Clé secrète JWT | (généré) |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth2 | - |
| `GOOGLE_CLIENT_SECRET` | Secret Google OAuth2 | - |
| `FRONTEND_URL` | URL du frontend | http://localhost:3000 |
| `VITE_API_URL` | URL de l'API pour le frontend | http://localhost:8080/api |

### Personnalisation des ports

Si les ports par défaut sont déjà utilisés, modifiez-les dans `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3001:80"  # Changez 3000 en 3001
```

## 📧 MailHog - Test des emails

MailHog capture tous les emails envoyés par l'application:

1. Accédez à http://localhost:8025
2. Tous les emails (OTP, notifications, etc.) apparaissent ici
3. Aucun email n'est réellement envoyé vers l'extérieur

## 🔒 Sécurité en Production

⚠️ **Ne pas utiliser cette configuration telle quelle en production !**

Pour la production:

1. Changez tous les mots de passe par défaut
2. Générez une nouvelle clé JWT: `openssl rand -base64 64`
3. Utilisez des certificats SSL/TLS
4. Configurez un vrai serveur SMTP
5. Activez les health checks stricts
6. Utilisez des secrets Docker ou un gestionnaire de secrets

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker compose logs backend

# Vérifier que MySQL est prêt
docker compose logs mysql | grep "ready for connections"
```

### Erreur de connexion à la base de données

```bash
# Vérifier que MySQL accepte les connexions
docker exec -it cameroun-tour-mysql mysql -u cameroun_user -p -e "SELECT 1;"
```

### Les données ne sont pas chargées

Les données sont automatiquement chargées au démarrage de Spring Boot grâce au fichier `data-etablissements.sql`. Si ce n'est pas le cas:

```bash
# Forcer le rechargement
docker compose restart backend
```

## 🔐 Accès au Panel Administrateur

Pour accéder au panel d'administration, vous devez avoir un compte avec le rôle `ADMIN`.

### Créer un compte administrateur

1. **Via SQL (recommandé pour le premier admin)**

```bash
# Se connecter au conteneur MySQL
docker exec -it cameroun-tour-mysql mysql -u cameroun_user -pcameroun_password cameroun_db

# Mettre à jour le rôle d'un utilisateur existant
UPDATE voyageur SET role = 'ADMIN' WHERE email = 'votre.email@example.com';
```

2. **Via l'API (si vous êtes déjà admin)**

```bash
curl -X PUT http://localhost:8080/api/admin/users/{publicId}/role?role=ADMIN \
  -H "Cookie: access_token=votre_token"
```

### Accéder au panel

1. Connectez-vous avec votre compte admin sur http://localhost:5173
2. Une icône 🛡️ (bouclier) apparaît dans le header
3. Cliquez dessus pour accéder au dashboard admin

### Fonctionnalités du panel admin

- **Dashboard** : Statistiques globales (utilisateurs, établissements, avis)
- **Utilisateurs** : Recherche, modification, verrouillage, suppression
- **Établissements** : Création, modification, suppression
- **Avis** : Modération et suppression

## 🏢 Accès au Panel Établissement

Les utilisateurs avec le rôle `ETABLISSEMENT` peuvent gérer leurs établissements.

### Devenir propriétaire d'établissement

```bash
# Via SQL
docker exec -it cameroun-tour-mysql mysql -u cameroun_user -pcameroun_password cameroun_db

UPDATE voyageur SET role = 'ETABLISSEMENT' WHERE email = 'proprietaire@example.com';
```

### Accéder au panel

1. Connectez-vous avec un compte ETABLISSEMENT
2. Une icône 🏢 (bâtiment) apparaît dans le header
3. Cliquez dessus pour gérer vos établissements

### Réinitialiser complètement

```bash
# Arrêter et supprimer tout
docker compose down -v

# Supprimer les images
docker compose down --rmi all

# Relancer
docker compose up -d --build
```

## 📁 Structure des fichiers Docker

```
cameroun-tourisme/
├── docker-compose.yml          # Orchestration des services
├── .env.example                # Template des variables d'env
├── .env                        # Variables d'env (à créer)
├── Makefile                    # Commandes raccourcies
├── DOCKER.md                   # Cette documentation
├── docker/
│   └── mysql/
│       └── init/
│           └── 01-init-database.sql  # Script init MySQL
├── client/
│   ├── Dockerfile              # Build frontend
│   ├── .dockerignore
│   └── nginx.conf              # Config Nginx
└── server/
    ├── Dockerfile              # Build backend
    ├── .dockerignore
    └── src/main/resources/
        └── application-docker.properties  # Config Spring Docker
```
