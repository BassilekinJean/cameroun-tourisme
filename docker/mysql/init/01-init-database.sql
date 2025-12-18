-- ================================================================
-- Script d'initialisation MySQL pour Docker
-- Ce script est exécuté automatiquement au premier démarrage du conteneur
-- ================================================================

-- Création de la base de données (si elle n'existe pas déjà)
CREATE DATABASE IF NOT EXISTS cameroun_tour 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE cameroun_tour;

-- Attribution des privilèges à l'utilisateur
GRANT ALL PRIVILEGES ON cameroun_tour.* TO 'cameroun_user'@'%';
FLUSH PRIVILEGES;

-- Message de confirmation
SELECT 'Base de données cameroun_tour initialisée avec succès!' AS message;
