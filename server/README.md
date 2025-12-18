# 🌍 CamerTrip - Backend

API REST Spring Boot pour CamerTrip, la plateforme de tourisme au Cameroun.

## 🚀 Technologies

- **Spring Boot 3.5** - Framework principal
- **Spring Modulith** - Architecture modulaire
- **Spring Security** - Authentification JWT
- **Spring Data JPA** - Accès aux données
- **MySQL** - Base de données
- **Redis** - Cache (optionnel)
- **Maven** - Gestion des dépendances

## 📦 Installation

### Prérequis

- Java 21+
- Maven 3.9+
- MySQL 8+
- Redis (optionnel)

### Installation locale

```bash
# Compiler le projet
./mvnw clean compile

# Lancer les tests
./mvnw test

# Lancer l'application
./mvnw spring-boot:run

# Build du JAR
./mvnw package -DskipTests
```

### Configuration

Copier et modifier le fichier de configuration :

```bash
cp src/main/resources/application-dev.properties src/main/resources/application-local.properties
```

Variables à configurer :
- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `app.jwt.secret`

## 📁 Architecture Modulaire (Spring Modulith)

```
com.cameroun_tour.tourisme/
│
├── voyageur/                    # Module Utilisateurs
│   ├── domain/                  # Entités JPA
│   │   └── Voyageur.java
│   ├── repository/              # Repositories Spring Data
│   │   └── VoyageurRepository.java
│   ├── service/                 # Logique métier
│   │   ├── UtilisateurService.java (interface publique)
│   │   └── UtilisateurServiceImpl.java
│   ├── controller/              # API REST
│   │   └── AuthController.java
│   └── assembler/               # DTO mappings
│       └── VoyageurAssembler.java
│
├── etablissement/               # Module Établissements
│   ├── domain/
│   │   └── Etablissement.java
│   ├── repository/
│   │   └── EtablissementRepository.java
│   ├── service/
│   │   ├── EtablissementServiceApi.java (interface publique)
│   │   └── EtablissementServiceImpl.java
│   └── controller/
│       └── EtablissementController.java
│
├── Avis/                        # Module Avis
│   ├── domain/
│   │   └── Avis.java
│   ├── repository/
│   │   └── AvisRepository.java
│   ├── service/
│   │   ├── AvisServiceApi.java (interface publique)
│   │   └── AviserviceImpl.java
│   └── controller/
│       └── AvisController.java
│
├── media/                       # Module Médias
│   ├── domain/
│   │   └── Media.java
│   ├── service/
│   │   └── MediaService.java
│   └── controller/
│       └── MediaController.java
│
├── admin/                       # Module Administration 🔐
│   └── controller/
│       └── AdminController.java
│
└── common/                      # Composants partagés
    ├── utils/
    │   ├── enums/
    │   │   ├── Role.java        # USER, ETABLISSEMENT, ADMIN
    │   │   └── Categorie.java   # HOTEL, RESTAURANT, ACTIVITE, DESTINATION
    │   └── exceptions/
    │       └── ...
    ├── security/
    │   ├── JwtUtil.java
    │   └── SecurityConfig.java
    └── contracts/               # DTOs partagés entre modules
        ├── AdminUserDto.java
        ├── AdminEtablissementDto.java
        ├── AdminAvisDto.java
        └── ...
```

## 🔐 Module Administration

### Sécurité

Tous les endpoints `/api/admin/**` sont protégés par `@PreAuthorize("hasRole('ADMIN')")`.

### Architecture inter-module

Le module admin utilise **les interfaces de service** des autres modules pour respecter l'isolation modulaire :

```java
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final UtilisateurService utilisateurService;
    private final EtablissementServiceApi etablissementService;
    private final AvisServiceApi avisService;
    
    // Pas d'accès direct aux repositories d'autres modules
}
```

### Endpoints disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/admin/stats` | GET | Statistiques globales |
| `/api/admin/users` | GET | Liste des utilisateurs |
| `/api/admin/users/{publicId}` | GET | Détails utilisateur |
| `/api/admin/users/{publicId}` | PUT | Modifier utilisateur |
| `/api/admin/users/{publicId}/role` | PUT | Changer le rôle |
| `/api/admin/users/{publicId}/toggle-lock` | PUT | Verrouiller/Déverrouiller |
| `/api/admin/users/{publicId}` | DELETE | Supprimer utilisateur |
| `/api/admin/users/batch` | DELETE | Suppression en lot |
| `/api/admin/etablissements` | GET | Liste établissements |
| `/api/admin/etablissements` | POST | Créer établissement |
| `/api/admin/etablissements/{publicId}` | PUT | Modifier établissement |
| `/api/admin/etablissements/{publicId}` | DELETE | Supprimer établissement |
| `/api/admin/avis` | GET | Liste des avis |
| `/api/admin/avis/{publicId}` | DELETE | Supprimer avis |
| `/api/admin/avis/batch` | DELETE | Suppression en lot |

## 🔑 Rôles et Permissions

```java
public enum Role {
    USER,           // Utilisateur standard
    ETABLISSEMENT,  // Propriétaire d'établissement
    ADMIN           // Administrateur
}
```

### Matrice des permissions

| Action | USER | ETABLISSEMENT | ADMIN |
|--------|------|---------------|-------|
| Consulter établissements | ✅ | ✅ | ✅ |
| Poster un avis | ✅ | ✅ | ✅ |
| Gérer ses établissements | ❌ | ✅ | ✅ |
| Panel admin | ❌ | ❌ | ✅ |
| Supprimer utilisateurs | ❌ | ❌ | ✅ |
| Modérer les avis | ❌ | ❌ | ✅ |

## 🔄 Communication inter-module

Les modules communiquent via des **interfaces de service** exposées publiquement :

```java
// Interface publique du module voyageur
public interface UtilisateurService {
    // Méthodes standards
    VoyageurResponse getCurrentUser();
    
    // Méthodes admin
    long countAll();
    Page<AdminUserDto> searchUsersForAdmin(String search, Role role, Pageable pageable);
    void updateUserRole(String publicId, Role newRole);
    // ...
}
```

Les DTOs partagés sont dans `common.contracts` pour éviter les dépendances circulaires.

## 🧪 Tests

```bash
# Tous les tests
./mvnw test

# Tests de modularité (Spring Modulith)
./mvnw test -Dtest=ModularityTest

# Tests avec couverture
./mvnw test jacoco:report
```

## 📊 Base de données

### Créer un administrateur

```sql
-- Après avoir créé un compte utilisateur normal
UPDATE voyageur SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### Données de test

Les données de test sont chargées automatiquement via `data-etablissements.sql` au démarrage en mode développement.

## 🚀 Déploiement

### Variables d'environnement

```env
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:mysql://host:3306/camertrip
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
JWT_SECRET=your-256-bit-secret
```

### Docker

```bash
# Build de l'image
docker build -t camertrip-backend .

# Lancer avec Docker Compose (depuis la racine)
docker compose up backend
```

## 📝 Notes de développement

### Conventions

- **Packages** : kebab-case (ex: `common.contracts`)
- **Classes** : PascalCase
- **Méthodes** : camelCase
- **DTOs** : suffixe `Dto`, `Request`, `Response`

### Bonnes pratiques Spring Modulith

1. Ne jamais exposer les entités JPA en dehors du module
2. Utiliser des DTOs dans `common.contracts` pour le partage
3. Les repositories sont internes au module
4. Seules les interfaces de service sont publiques

## 📄 Licence

MIT - Voir le fichier LICENSE à la racine du projet
