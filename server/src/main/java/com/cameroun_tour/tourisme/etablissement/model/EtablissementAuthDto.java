package com.cameroun_tour.tourisme.etablissement.model;

import java.util.UUID;

import com.cameroun_tour.tourisme.common.utils.enums.Role;
import com.cameroun_tour.tourisme.etablissement.Etablissement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour la réponse d'authentification des établissements
 * Contient les informations nécessaires pour le frontend après connexion
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtablissementAuthDto {
    private UUID publicId;
    private String nom;
    private String email;
    private String photoProfile;
    private String ville;
    private String telephone;
    private Role role;
    
    public static EtablissementAuthDto fromEntity(Etablissement etablissement) {
        return EtablissementAuthDto.builder()
                .publicId(etablissement.getPublicId())
                .nom(etablissement.getNom())
                .email(etablissement.getEmail())
                .photoProfile(etablissement.getPhotoProfile())
                .ville(etablissement.getVille())
                .telephone(etablissement.getTelephone())
                .role(Role.ETABLISSEMENT)
                .build();
    }
}
