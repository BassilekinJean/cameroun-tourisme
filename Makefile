# ================================================================
# Makefile - Cameroun Tourisme Docker
# Commandes raccourcies pour la gestion Docker
# ================================================================

.PHONY: help up down build rebuild logs logs-backend logs-frontend logs-mysql shell-backend shell-mysql shell-redis clean clean-all init-data

# Couleurs pour l'affichage
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Affiche cette aide
	@echo "$(GREEN)Cameroun Tourisme - Commandes Docker$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# ================================================================
# Gestion des conteneurs
# ================================================================

up: ## Démarrer tous les services
	@echo "$(GREEN)Démarrage des services...$(NC)"
	docker compose up -d
	@echo "$(GREEN)✓ Services démarrés$(NC)"
	@echo ""
	@echo "Frontend:    http://localhost:3000"
	@echo "Backend:     http://localhost:8080"
	@echo "Swagger:     http://localhost:8080/swagger-ui.html"
	@echo "MailHog:     http://localhost:8025"

down: ## Arrêter tous les services
	@echo "$(YELLOW)Arrêt des services...$(NC)"
	docker compose down
	@echo "$(GREEN)✓ Services arrêtés$(NC)"

build: ## Construire les images
	@echo "$(GREEN)Construction des images...$(NC)"
	docker compose build
	@echo "$(GREEN)✓ Images construites$(NC)"

rebuild: ## Reconstruire et redémarrer
	@echo "$(GREEN)Reconstruction et redémarrage...$(NC)"
	docker compose up -d --build
	@echo "$(GREEN)✓ Services reconstruits et démarrés$(NC)"

restart: ## Redémarrer tous les services
	@echo "$(YELLOW)Redémarrage des services...$(NC)"
	docker compose restart
	@echo "$(GREEN)✓ Services redémarrés$(NC)"

# ================================================================
# Logs
# ================================================================

logs: ## Voir les logs de tous les services
	docker compose logs -f

logs-backend: ## Voir les logs du backend
	docker compose logs -f backend

logs-frontend: ## Voir les logs du frontend
	docker compose logs -f frontend

logs-mysql: ## Voir les logs de MySQL
	docker compose logs -f mysql

logs-redis: ## Voir les logs de Redis
	docker compose logs -f redis

# ================================================================
# Accès aux shells
# ================================================================

shell-backend: ## Ouvrir un shell dans le backend
	docker exec -it cameroun-tour-backend sh

shell-mysql: ## Ouvrir MySQL CLI
	docker exec -it cameroun-tour-mysql mysql -u cameroun_user -pcameroun_password cameroun_tour

shell-redis: ## Ouvrir Redis CLI
	docker exec -it cameroun-tour-redis redis-cli

# ================================================================
# Base de données
# ================================================================

init-data: ## Charger les données d'établissements
	@echo "$(GREEN)Chargement des données...$(NC)"
	docker exec -i cameroun-tour-mysql mysql -u cameroun_user -pcameroun_password cameroun_tour < ./server/src/main/resources/data-etablissements.sql
	@echo "$(GREEN)✓ Données chargées$(NC)"

backup-db: ## Sauvegarder la base de données
	@echo "$(GREEN)Sauvegarde de la base...$(NC)"
	docker exec cameroun-tour-mysql mysqldump -u cameroun_user -pcameroun_password cameroun_tour > backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "$(GREEN)✓ Sauvegarde créée$(NC)"

# ================================================================
# Nettoyage
# ================================================================

clean: ## Arrêter et supprimer les conteneurs
	@echo "$(RED)Nettoyage des conteneurs...$(NC)"
	docker compose down
	@echo "$(GREEN)✓ Conteneurs supprimés$(NC)"

clean-volumes: ## Supprimer les volumes (⚠️ perte de données)
	@echo "$(RED)⚠️  Suppression des volumes...$(NC)"
	docker compose down -v
	@echo "$(GREEN)✓ Volumes supprimés$(NC)"

clean-all: ## Tout supprimer (conteneurs, images, volumes)
	@echo "$(RED)⚠️  Suppression complète...$(NC)"
	docker compose down -v --rmi all
	@echo "$(GREEN)✓ Tout a été supprimé$(NC)"

# ================================================================
# Status
# ================================================================

status: ## Voir le status des services
	docker compose ps

health: ## Vérifier la santé des services
	@echo "$(GREEN)Vérification de la santé des services...$(NC)"
	@docker compose ps --format "table {{.Name}}\t{{.Status}}"

# ================================================================
# Développement
# ================================================================

dev-backend: ## Démarrer uniquement les dépendances (pour dev backend local)
	@echo "$(GREEN)Démarrage des dépendances (MySQL, Redis, MailHog)...$(NC)"
	docker compose up -d mysql redis mailhog
	@echo "$(GREEN)✓ Dépendances démarrées$(NC)"
	@echo ""
	@echo "MySQL:   localhost:3307"
	@echo "Redis:   localhost:6380"
	@echo "MailHog: localhost:8025"

dev-frontend: ## Démarrer backend + dépendances (pour dev frontend local)
	@echo "$(GREEN)Démarrage du backend et des dépendances...$(NC)"
	docker compose up -d mysql redis mailhog backend
	@echo "$(GREEN)✓ Services démarrés$(NC)"
	@echo ""
	@echo "Backend: http://localhost:8080"
	@echo "Swagger: http://localhost:8080/swagger-ui.html"
