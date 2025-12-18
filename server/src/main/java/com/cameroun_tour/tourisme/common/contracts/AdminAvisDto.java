package com.cameroun_tour.tourisme.common.contracts;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO pour la gestion des avis dans le panel admin.
 * Utilisé pour la communication inter-modules.
 */
public record AdminAvisDto(
    UUID publicId,
    String message,
    int note,
    LocalDate dateCreation,
    int nombreLikes,
    UUID auteurId,
    String auteurNom,
    String auteurEmail,
    UUID etablissementId,
    String etablissementNom
) {
    /**
     * Builder statique pour créer un AdminAvisDto
     */
    public static AdminAvisDtoBuilder builder() {
        return new AdminAvisDtoBuilder();
    }

    public static class AdminAvisDtoBuilder {
        private UUID publicId;
        private String message;
        private int note;
        private LocalDate dateCreation;
        private int nombreLikes;
        private UUID auteurId;
        private String auteurNom;
        private String auteurEmail;
        private UUID etablissementId;
        private String etablissementNom;

        public AdminAvisDtoBuilder publicId(UUID publicId) {
            this.publicId = publicId;
            return this;
        }

        public AdminAvisDtoBuilder message(String message) {
            this.message = message;
            return this;
        }

        public AdminAvisDtoBuilder note(int note) {
            this.note = note;
            return this;
        }

        public AdminAvisDtoBuilder dateCreation(LocalDate dateCreation) {
            this.dateCreation = dateCreation;
            return this;
        }

        public AdminAvisDtoBuilder nombreLikes(int nombreLikes) {
            this.nombreLikes = nombreLikes;
            return this;
        }

        public AdminAvisDtoBuilder auteurId(UUID auteurId) {
            this.auteurId = auteurId;
            return this;
        }

        public AdminAvisDtoBuilder auteurNom(String auteurNom) {
            this.auteurNom = auteurNom;
            return this;
        }

        public AdminAvisDtoBuilder auteurEmail(String auteurEmail) {
            this.auteurEmail = auteurEmail;
            return this;
        }

        public AdminAvisDtoBuilder etablissementId(UUID etablissementId) {
            this.etablissementId = etablissementId;
            return this;
        }

        public AdminAvisDtoBuilder etablissementNom(String etablissementNom) {
            this.etablissementNom = etablissementNom;
            return this;
        }

        public AdminAvisDto build() {
            return new AdminAvisDto(publicId, message, note, dateCreation, nombreLikes,
                                   auteurId, auteurNom, auteurEmail, etablissementId, etablissementNom);
        }
    }
}
