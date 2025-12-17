package com.cameroun_tour.tourisme.etablissement.model;

import java.util.List;
import java.util.UUID;

import org.springframework.hateoas.RepresentationModel;

import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO de réponse pour un établissement (HATEOAS)
 * Utilisé pour les réponses API avec liens hypermedia
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class EtablissementResponse extends RepresentationModel<EtablissementResponse> {

    private UUID publicId;
    private String nom;
    private String description;
    private String email;
    private String telephone;
    private String photoProfile;
    private String adresse;
    private String ville;
    private List<String> images;
    private TypeLieu categorie;
    private int nombreAvis;
    private Double rating;
    private String dateInscription;

    /**
     * Crée un EtablissementResponse à partir d'une entité Etablissement
     */
    public static EtablissementResponse fromEntity(com.cameroun_tour.tourisme.etablissement.Etablissement etablissement) {
        return EtablissementResponse.builder()
                .publicId(etablissement.getPublicId())
                .nom(etablissement.getNom())
                .description(etablissement.getDescription())
                .email(etablissement.getEmail())
                .telephone(etablissement.getTelephone())
                .photoProfile(etablissement.getPhotoProfile())
                .adresse(etablissement.getAdresse())
                .ville(etablissement.getVille())
                .images(etablissement.getImages())
                .categorie(etablissement.getCategorie())
                .nombreAvis(etablissement.getNombreFavoris()) // Note: nombreFavoris utilisé comme nombreAvis
                .dateInscription(etablissement.getCreatedAt() != null 
                    ? etablissement.getCreatedAt().toLocalDate().toString() 
                    : null)
                .build();
    }
}
