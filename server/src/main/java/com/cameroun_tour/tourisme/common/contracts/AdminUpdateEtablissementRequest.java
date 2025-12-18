package com.cameroun_tour.tourisme.common.contracts;

import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;

import java.util.List;

/**
 * DTO pour la mise à jour d'un établissement via l'admin.
 * Utilisé pour la communication inter-modules.
 */
public record AdminUpdateEtablissementRequest(
    String nom,
    String description,
    String email,
    String telephone,
    String photoProfile,
    String adresse,
    String ville,
    List<String> images,
    TypeLieu categorie,
    Double latitude,
    Double longitude
) {}
