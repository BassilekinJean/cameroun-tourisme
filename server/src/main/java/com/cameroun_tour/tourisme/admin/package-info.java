/**
 * Module d'administration.
 * Utilise uniquement les interfaces publiques des autres modules.
 * 
 * Ce module fournit:
 * - Gestion des utilisateurs (CRUD, changement de rôle, verrouillage)
 * - Gestion des établissements (CRUD)
 * - Gestion des avis (suppression, modération)
 * - Statistiques globales du système
 * 
 * Communication inter-modules:
 * - Utilise UtilisateurService (interface) du module voyageur
 * - Utilise EtablissementServiceApi (interface) du module etablissement
 * - Utilise AvisServiceApi (interface) du module Avis
 * - Utilise les DTOs partagés de common.contracts
 */
@org.springframework.modulith.ApplicationModule(
    allowedDependencies = {
        "voyageur",
        "etablissement",
        "Avis",
        "common"
    }
)
package com.cameroun_tour.tourisme.admin;
