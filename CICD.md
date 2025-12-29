# 🚀 Guide Complet CI/CD - Déploiement Automatisé

Ce document explique en détail le fonctionnement du pipeline CI/CD (Continuous Integration / Continuous Deployment) configuré pour déployer automatiquement l'application Cameroun Tourisme vers un VPS.

---

## 📚 Table des matières

1. [Qu'est-ce que le CI/CD ?](#quest-ce-que-le-cicd-)
2. [Architecture du Pipeline](#architecture-du-pipeline)
3. [Explication détaillée du workflow](#explication-détaillée-du-workflow)
4. [Configuration requise](#configuration-requise)
5. [Utilisation](#utilisation)
6. [Dépannage](#dépannage)

---

## Qu'est-ce que le CI/CD ?

### CI - Continuous Integration (Intégration Continue)

L'**Intégration Continue** est une pratique de développement où les développeurs intègrent fréquemment leur code dans un dépôt partagé. Chaque intégration est vérifiée par une **build automatisée** et des **tests automatisés**.

**Objectifs :**
- Détecter les bugs rapidement
- Réduire les conflits de code
- Garantir que le code compile toujours
- Maintenir une qualité de code constante

### CD - Continuous Deployment (Déploiement Continu)

Le **Déploiement Continu** est une extension du CI où chaque changement qui passe les tests est automatiquement déployé en production.

**Objectifs :**
- Livrer rapidement les nouvelles fonctionnalités
- Réduire les risques liés aux gros déploiements
- Automatiser les tâches répétitives
- Assurer la reproductibilité des déploiements

### Différence avec Continuous Delivery

| Concept | Description |
|---------|-------------|
| **Continuous Delivery** | Le code est prêt à être déployé à tout moment, mais le déploiement nécessite une approbation manuelle |
| **Continuous Deployment** | Le déploiement est entièrement automatisé sans intervention humaine |

---

## Architecture du Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        GITHUB ACTIONS WORKFLOW                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────┐    ┌──────────────────┐                          │
│  │  test-backend    │    │  test-frontend   │     ← CI (Tests)         │
│  │  (Maven + MySQL) │    │  (Vitest + npm)  │                          │
│  └────────┬─────────┘    └────────┬─────────┘                          │
│           │                       │                                     │
│           └───────────┬───────────┘                                     │
│                       ▼                                                 │
│           ┌──────────────────────┐                                      │
│           │       build          │             ← Build Docker          │
│           │ (Build + Push ghcr)  │                                      │
│           └──────────┬───────────┘                                      │
│                      ▼                                                  │
│           ┌──────────────────────┐                                      │
│           │       deploy         │             ← CD (Déploiement)      │
│           │   (SSH vers VPS)     │                                      │
│           └──────────────────────┘                                      │
│                      │                                                  │
└──────────────────────┼──────────────────────────────────────────────────┘
                       ▼
              ┌─────────────────┐
              │      VPS        │
              │  (Production)   │
              └─────────────────┘
```

---

## Explication détaillée du workflow

### 1. En-tête et métadonnées

```yaml
name: CI/CD Deploy to VPS
```

**Pourquoi ?** Le `name` donne un nom lisible au workflow. Ce nom apparaît dans l'interface GitHub Actions.

---

### 2. Déclencheurs (`on`)

```yaml
on:
  push:
    branches: [ "prod" ]
    paths-ignore:
      - '**/README.md'
      - '**/LICENSE'
  workflow_dispatch:
    inputs:
      skip_tests:
        description: 'Skip tests and deploy directly'
        required: false
        type: boolean
        default: false
```

| Élément | Explication | Justification |
|---------|-------------|---------------|
| `push.branches: ["prod"]` | Déclenche le workflow sur chaque push vers la branche `prod` | On ne veut déployer que le code validé sur la branche de production |
| `paths-ignore` | Ignore les modifications sur README.md et LICENSE | Évite un déploiement inutile pour des changements de documentation |
| `workflow_dispatch` | Permet de lancer le workflow manuellement depuis l'interface GitHub | Utile pour re-déployer sans faire de commit ou pour des déploiements d'urgence |
| `inputs.skip_tests` | Option pour sauter les tests | Permet un déploiement rapide en cas d'urgence (hotfix) |

---

### 3. Variables d'environnement globales (`env`)

```yaml
env:
  REGISTRY: ghcr.io
  BACKEND_IMAGE: ghcr.io/${{ github.repository }}/backend
  FRONTEND_IMAGE: ghcr.io/${{ github.repository }}/frontend
```

| Variable | Valeur | Justification |
|----------|--------|---------------|
| `REGISTRY` | `ghcr.io` | GitHub Container Registry - gratuit pour les repos GitHub, intégration native |
| `BACKEND_IMAGE` | `ghcr.io/{owner}/{repo}/backend` | Nom complet de l'image Docker du backend |
| `FRONTEND_IMAGE` | `ghcr.io/{owner}/{repo}/frontend` | Nom complet de l'image Docker du frontend |

**Pourquoi ghcr.io ?**
- Gratuit pour les dépôts publics
- Intégré à GitHub (authentification avec `GITHUB_TOKEN`)
- Pas besoin de compte Docker Hub séparé

---

### 4. Permissions

```yaml
permissions:
  contents: read
  packages: write
```

| Permission | Justification |
|------------|---------------|
| `contents: read` | Permet de lire le code source (checkout) |
| `packages: write` | Permet de pousser les images Docker vers ghcr.io |

**Principe de sécurité :** On accorde le **minimum de permissions nécessaires** (Principle of Least Privilege).

---

### 5. Job `test-backend`

```yaml
test-backend:
  name: 🧪 Test Backend
  runs-on: ubuntu-latest
  if: ${{ !inputs.skip_tests }}
```

| Élément | Explication |
|---------|-------------|
| `runs-on: ubuntu-latest` | Exécute sur une VM Ubuntu fraîche fournie par GitHub |
| `if: ${{ !inputs.skip_tests }}` | Saute ce job si l'option "skip tests" est activée |

#### Services conteneurs

```yaml
services:
  mysql:
    image: mysql:8.0
    ports:
      - 3306:3306
    env:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: cameroun_tour_test
      MYSQL_USER: testuser
      MYSQL_PASSWORD: testpassword
    options: >-
      --health-cmd="mysqladmin ping --silent"
      --health-interval=10s
      --health-timeout=5s
      --health-retries=10
```

**Pourquoi des services ?**
- Les tests Spring Boot ont besoin d'une vraie base de données
- GitHub Actions fournit des conteneurs Docker qui tournent pendant le job
- `options` contient les health checks pour s'assurer que MySQL est prêt avant les tests

#### Steps (étapes)

```yaml
steps:
  - name: 📥 Checkout code
    uses: actions/checkout@v4
```

**`actions/checkout@v4`** : Action officielle GitHub pour cloner le dépôt dans le runner.

```yaml
  - name: ☕ Set up JDK 21
    uses: actions/setup-java@v4
    with:
      java-version: '21'
      distribution: 'temurin'
      cache: maven
```

| Paramètre | Justification |
|-----------|---------------|
| `java-version: '21'` | Version Java du projet |
| `distribution: 'temurin'` | Distribution Eclipse Temurin (anciennement AdoptOpenJDK) |
| `cache: maven` | Met en cache les dépendances Maven pour accélérer les builds suivants |

```yaml
  - name: 🧪 Run Backend Tests
    working-directory: server
    env:
      DB_USER_MYSQL: testuser
      DB_PASSWORD_MYSQL: testpassword
    run: mvn -B test --file pom.xml
```

| Élément | Explication |
|---------|-------------|
| `working-directory: server` | Les commandes s'exécutent dans le dossier `server/` |
| `mvn -B test` | `-B` = mode batch (non-interactif), `test` = exécute les tests |

---

### 6. Job `test-frontend`

```yaml
test-frontend:
  name: 🧪 Test Frontend
  runs-on: ubuntu-latest
  if: ${{ !inputs.skip_tests }}

  defaults:
    run:
      working-directory: ./client
```

**`defaults.run.working-directory`** : Toutes les commandes `run` s'exécutent dans `./client` par défaut.

```yaml
  - name: 📦 Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      cache-dependency-path: './client/package-lock.json'
```

| Paramètre | Justification |
|-----------|---------------|
| `cache: 'npm'` | Met en cache `node_modules` basé sur `package-lock.json` |
| `cache-dependency-path` | Spécifie le chemin du lock file pour le calcul du hash de cache |

```yaml
  - name: 📦 Install dependencies
    run: npm ci
```

**`npm ci` vs `npm install` :**
| Commande | Comportement |
|----------|--------------|
| `npm install` | Met à jour `package-lock.json` si nécessaire |
| `npm ci` | Installation **exacte** selon `package-lock.json`, échoue si incohérence |

**→ `npm ci` est recommandé en CI pour garantir la reproductibilité.**

---

### 7. Job `build`

```yaml
build:
  name: 🔨 Build & Push Docker Images
  runs-on: ubuntu-latest
  needs: [test-backend, test-frontend]
  if: |
    always() && 
    (needs.test-backend.result == 'success' || needs.test-backend.result == 'skipped') &&
    (needs.test-frontend.result == 'success' || needs.test-frontend.result == 'skipped')
```

| Élément | Explication |
|---------|-------------|
| `needs: [test-backend, test-frontend]` | Ce job attend la fin des jobs de test |
| `always()` | Évalue la condition même si les jobs précédents ont été skippés |
| `result == 'skipped'` | Permet de continuer si les tests ont été sautés volontairement |

#### Outputs

```yaml
outputs:
  backend_tag: ${{ steps.meta-backend.outputs.tags }}
  frontend_tag: ${{ steps.meta-frontend.outputs.tags }}
```

**Pourquoi ?** Permet aux jobs suivants de récupérer les tags des images buildées.

#### Login Registry

```yaml
- name: 🔐 Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ${{ env.REGISTRY }}
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

| Élément | Explication |
|---------|-------------|
| `github.actor` | L'utilisateur qui a déclenché le workflow |
| `GITHUB_TOKEN` | Token automatique fourni par GitHub, valide uniquement pendant le workflow |

#### Metadata extraction

```yaml
- name: 🏷️ Extract metadata for Backend
  id: meta-backend
  uses: docker/metadata-action@v5
  with:
    images: ${{ env.BACKEND_IMAGE }}
    tags: |
      type=sha,prefix=
      type=raw,value=latest
```

**Ce que fait cette action :**
- `type=sha` : Crée un tag avec le SHA du commit (ex: `abc1234`)
- `type=raw,value=latest` : Crée aussi le tag `latest`

**Pourquoi deux tags ?**
| Tag | Usage |
|-----|-------|
| `sha` (ex: `abc1234`) | Permet le rollback vers une version spécifique |
| `latest` | Facilite le déploiement (toujours la dernière version) |

#### Build & Push

```yaml
- name: 🔨 Build & Push Backend Image
  uses: docker/build-push-action@v5
  with:
    context: ./server
    file: ./server/Dockerfile
    push: true
    tags: ${{ steps.meta-backend.outputs.tags }}
    labels: ${{ steps.meta-backend.outputs.labels }}
```

| Paramètre | Explication |
|-----------|-------------|
| `context` | Dossier de contexte Docker (envoyé au daemon Docker) |
| `file` | Chemin vers le Dockerfile |
| `push: true` | Pousse l'image vers le registry après le build |
| `tags` | Tags générés par l'action metadata |
| `labels` | Labels OCI (métadonnées de l'image) |

---

### 8. Job `deploy`

```yaml
deploy:
  name: 🚀 Deploy to VPS
  runs-on: ubuntu-latest
  needs: build
  environment: production
```

| Élément | Explication |
|---------|-------------|
| `needs: build` | Attend que le build soit terminé |
| `environment: production` | Utilise l'environnement GitHub "production" (permet d'ajouter des approbations) |

#### Copie du docker-compose

```yaml
- name: 📋 Copy docker-compose to VPS
  uses: appleboy/scp-action@v0.1.7
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USER }}
    key: ${{ secrets.VPS_SSH_KEY }}
    port: ${{ secrets.VPS_SSH_PORT || 22 }}
    source: "docker-compose.prod.yml"
    target: ${{ secrets.VPS_DEPLOY_PATH }}
```

**`appleboy/scp-action`** : Copie des fichiers via SCP (Secure Copy Protocol).

| Paramètre | Explication |
|-----------|-------------|
| `host` | Adresse IP ou hostname du VPS |
| `key` | Clé SSH privée (stockée dans les secrets) |
| `source` | Fichier(s) à copier |
| `target` | Destination sur le VPS |

#### Déploiement SSH

```yaml
- name: 🚀 Deploy to VPS via SSH
  uses: appleboy/ssh-action@v1.0.3
  env:
    REGISTRY: ${{ env.REGISTRY }}
    BACKEND_IMAGE: ${{ env.BACKEND_IMAGE }}:latest
    FRONTEND_IMAGE: ${{ env.FRONTEND_IMAGE }}:latest
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USER }}
    key: ${{ secrets.VPS_SSH_KEY }}
    port: ${{ secrets.VPS_SSH_PORT || 22 }}
    envs: REGISTRY,BACKEND_IMAGE,FRONTEND_IMAGE
    script: |
      cd ${{ secrets.VPS_DEPLOY_PATH }}
      
      # Login to GitHub Container Registry
      echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
      
      # Pull latest images
      docker pull $BACKEND_IMAGE
      docker pull $FRONTEND_IMAGE
      
      # Stop and remove old containers
      docker compose -f docker-compose.prod.yml down --remove-orphans || true
      
      # Start new containers
      export BACKEND_IMAGE=$BACKEND_IMAGE
      export FRONTEND_IMAGE=$FRONTEND_IMAGE
      docker compose -f docker-compose.prod.yml up -d
      
      # Cleanup old images
      docker image prune -f
      
      # Show status
      docker compose -f docker-compose.prod.yml ps
```

**Détail du script de déploiement :**

| Commande | Explication |
|----------|-------------|
| `docker login ghcr.io` | Authentification pour pull les images privées |
| `docker pull $BACKEND_IMAGE` | Télécharge la dernière version de l'image |
| `docker compose down` | Arrête les conteneurs existants |
| `--remove-orphans` | Supprime les conteneurs qui ne sont plus dans le compose |
| `|| true` | Continue même si aucun conteneur n'existe |
| `docker compose up -d` | Démarre les nouveaux conteneurs en mode détaché |
| `docker image prune -f` | Supprime les images non utilisées (libère de l'espace) |

---

## Configuration requise

### Secrets GitHub

Aller dans **Settings → Secrets and variables → Actions** :

| Secret | Description | Exemple |
|--------|-------------|---------|
| `VPS_HOST` | IP ou hostname du VPS | `123.45.67.89` |
| `VPS_USER` | Utilisateur SSH | `deploy` |
| `VPS_SSH_KEY` | Clé SSH **privée** | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_SSH_PORT` | Port SSH (optionnel) | `22` |
| `VPS_DEPLOY_PATH` | Chemin de déploiement | `/opt/cameroun-tourisme` |
| `VITE_API_URL` | URL de l'API | `https://api.example.com` |
| `VITE_SUPABASE_URL` | URL Supabase | `https://xxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Clé publique Supabase | `eyJ...` |

### Prérequis VPS

1. Docker et Docker Compose installés
2. Utilisateur avec accès sudo et groupe `docker`
3. Clé SSH publique ajoutée à `~/.ssh/authorized_keys`
4. Fichier `.env` créé dans le `VPS_DEPLOY_PATH`

---

## Utilisation

### Déploiement automatique

```bash
git checkout prod
git merge main
git push origin prod
```

Le pipeline se déclenche automatiquement.

### Déploiement manuel

1. Aller sur GitHub → Actions → CI/CD Deploy to VPS
2. Cliquer sur "Run workflow"
3. Optionnellement cocher "Skip tests"
4. Cliquer sur "Run workflow"

### Rollback

Pour revenir à une version précédente :

```bash
# Sur le VPS
docker pull ghcr.io/user/repo/backend:abc1234  # SHA du commit
docker compose -f docker-compose.prod.yml up -d
```

---

## Dépannage

### Le workflow échoue aux tests

- Vérifier les logs dans GitHub Actions
- S'assurer que les tests passent localement
- Utiliser l'option "Skip tests" en dernier recours

### Échec de connexion SSH

- Vérifier que `VPS_SSH_KEY` contient la clé **privée** complète
- Vérifier que la clé publique est dans `authorized_keys` sur le VPS
- Vérifier que le port SSH est correct

### Les images ne sont pas trouvées

- Vérifier les permissions du package GitHub
- Aller dans Packages → Settings → Make public (ou ajouter les permissions)

### L'application ne démarre pas

```bash
# Sur le VPS
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
```

---

## Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Appleboy SSH Action](https://github.com/appleboy/ssh-action)
