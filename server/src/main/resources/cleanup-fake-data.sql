-- ================================================================
-- Script SQL: Nettoyage des données fictives
-- Base de données: cameroun_tour (MySQL)
-- ================================================================
-- Ce script supprime tous les avis et likes fictifs de la base de données
-- Exécutez ce script uniquement en environnement de développement/test

-- Désactiver les contraintes de clé étrangère temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- ================================================================
-- SUPPRESSION DES AVIS ET LIKES
-- ================================================================

-- Supprimer tous les likes d'avis
TRUNCATE TABLE avis_likes;

-- Supprimer tous les avis
DELETE FROM avis;

-- Réinitialiser l'auto-increment de la table avis
ALTER TABLE avis AUTO_INCREMENT = 1;

-- ================================================================
-- RÉINITIALISATION DES COMPTEURS D'ÉTABLISSEMENTS
-- ================================================================

-- Remettre à zéro le nombre de favoris de tous les établissements
UPDATE etablissement SET nombre_favoris = 0;

-- ================================================================
-- NETTOYAGE DES FAVORIS UTILISATEURS (si table existe)
-- ================================================================

-- Supprimer tous les favoris utilisateurs
DELETE FROM user_favorites WHERE 1=1;

-- Réactiver les contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 1;

-- Message de confirmation
SELECT 'Données fictives supprimées avec succès!' AS message;
SELECT CONCAT('Nombre d''avis supprimés: ', ROW_COUNT()) AS resultat;
