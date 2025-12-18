package com.cameroun_tour.tourisme.common.contracts;

import com.cameroun_tour.tourisme.common.utils.enums.Role;

/**
 * DTO pour la mise à jour d'un utilisateur via l'admin.
 * Utilisé pour la communication inter-modules.
 */
public record AdminUpdateUserRequest(
    String nomComplet,
    String email,
    String paysOrigine,
    Role role
) {}
