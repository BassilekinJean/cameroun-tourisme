package com.cameroun_tour.tourisme.etablissement.model;

import java.util.List;
import java.util.UUID;

import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO simplifié pour affichage en liste
 * Moins de données que EtablissementResponse pour optimiser les performances
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtablissementListItem {

    private UUID publicId;
    private String nom;
    private String description;
    private String ville;
    private String photoProfile;
    private List<String> images;
    private TypeLieu categorie;
    private int nombreFavoris;
    private int nombreAvis;
    private Double rating;

    /**
     * Crée un EtablissementListItem à partir d'une entité Etablissement
     */
    public static EtablissementListItem fromEntity(com.cameroun_tour.tourisme.etablissement.Etablissement etablissement) {
        return EtablissementListItem.builder()
                .publicId(etablissement.getPublicId())
                .nom(etablissement.getNom())
                .description(etablissement.getDescription())
                .ville(etablissement.getVille())
                .photoProfile(etablissement.getPhotoProfile())
                .images(etablissement.getImages())
                .categorie(etablissement.getCategorie())
                .nombreFavoris(etablissement.getNombreFavoris())
                .nombreAvis(etablissement.getNombreFavoris())
                .build();
    }
}
