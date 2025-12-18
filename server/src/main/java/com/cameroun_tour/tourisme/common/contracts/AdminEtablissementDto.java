package com.cameroun_tour.tourisme.common.contracts;

import java.util.List;
import java.util.UUID;

import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;

/**
 * DTO pour la gestion des établissements dans le panel admin.
 * Utilisé pour la communication inter-modules.
 */
public record AdminEtablissementDto(
    UUID publicId,
    String nom,
    String description,
    String email,
    String telephone,
    String adresse,
    String ville,
    String photoProfile,
    List<String> images,
    TypeLieu categorie,
    Double latitude,
    Double longitude,
    int nombreFavoris,
    int nombreAvis,
    Double rating
) {
    /**
     * Builder statique pour créer un AdminEtablissementDto
     */
    public static AdminEtablissementDtoBuilder builder() {
        return new AdminEtablissementDtoBuilder();
    }

    public static class AdminEtablissementDtoBuilder {
        private UUID publicId;
        private String nom;
        private String description;
        private String email;
        private String telephone;
        private String adresse;
        private String ville;
        private String photoProfile;
        private List<String> images;
        private TypeLieu categorie;
        private Double latitude;
        private Double longitude;
        private int nombreFavoris;
        private int nombreAvis;
        private Double rating;

        public AdminEtablissementDtoBuilder publicId(UUID publicId) {
            this.publicId = publicId;
            return this;
        }

        public AdminEtablissementDtoBuilder nom(String nom) {
            this.nom = nom;
            return this;
        }

        public AdminEtablissementDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public AdminEtablissementDtoBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AdminEtablissementDtoBuilder telephone(String telephone) {
            this.telephone = telephone;
            return this;
        }

        public AdminEtablissementDtoBuilder adresse(String adresse) {
            this.adresse = adresse;
            return this;
        }

        public AdminEtablissementDtoBuilder ville(String ville) {
            this.ville = ville;
            return this;
        }

        public AdminEtablissementDtoBuilder photoProfile(String photoProfile) {
            this.photoProfile = photoProfile;
            return this;
        }

        public AdminEtablissementDtoBuilder images(List<String> images) {
            this.images = images;
            return this;
        }

        public AdminEtablissementDtoBuilder categorie(TypeLieu categorie) {
            this.categorie = categorie;
            return this;
        }

        public AdminEtablissementDtoBuilder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public AdminEtablissementDtoBuilder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public AdminEtablissementDtoBuilder nombreFavoris(int nombreFavoris) {
            this.nombreFavoris = nombreFavoris;
            return this;
        }

        public AdminEtablissementDtoBuilder nombreAvis(int nombreAvis) {
            this.nombreAvis = nombreAvis;
            return this;
        }

        public AdminEtablissementDtoBuilder rating(Double rating) {
            this.rating = rating;
            return this;
        }

        public AdminEtablissementDto build() {
            return new AdminEtablissementDto(publicId, nom, description, email, telephone, 
                                            adresse, ville, photoProfile, images, categorie,
                                            latitude, longitude, nombreFavoris, nombreAvis, rating);
        }
    }
}
