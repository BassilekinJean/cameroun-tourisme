package com.cameroun_tour.tourisme.common.contracts;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.cameroun_tour.tourisme.common.utils.enums.Role;

/**
 * DTO pour la gestion des utilisateurs dans le panel admin.
 * Utilisé pour la communication inter-modules.
 */
public record AdminUserDto(
    UUID publicId,
    String nomComplet,
    String email,
    String paysOrigine,
    String photoProfile,
    Set<UUID> favorisIds,
    Role role,
    boolean accountLocked,
    boolean emailVerified,
    LocalDateTime dateCreation
) {
    /**
     * Builder statique pour créer un AdminUserDto
     */
    public static AdminUserDtoBuilder builder() {
        return new AdminUserDtoBuilder();
    }

    public static class AdminUserDtoBuilder {
        private UUID publicId;
        private String nomComplet;
        private String email;
        private String paysOrigine;
        private String photoProfile;
        private Set<UUID> favorisIds;
        private Role role;
        private boolean accountLocked;
        private boolean emailVerified;
        private LocalDateTime dateCreation;

        public AdminUserDtoBuilder publicId(UUID publicId) {
            this.publicId = publicId;
            return this;
        }

        public AdminUserDtoBuilder nomComplet(String nomComplet) {
            this.nomComplet = nomComplet;
            return this;
        }

        public AdminUserDtoBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AdminUserDtoBuilder paysOrigine(String paysOrigine) {
            this.paysOrigine = paysOrigine;
            return this;
        }

        public AdminUserDtoBuilder photoProfile(String photoProfile) {
            this.photoProfile = photoProfile;
            return this;
        }

        public AdminUserDtoBuilder favorisIds(Set<UUID> favorisIds) {
            this.favorisIds = favorisIds;
            return this;
        }

        public AdminUserDtoBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public AdminUserDtoBuilder accountLocked(boolean accountLocked) {
            this.accountLocked = accountLocked;
            return this;
        }

        public AdminUserDtoBuilder emailVerified(boolean emailVerified) {
            this.emailVerified = emailVerified;
            return this;
        }

        public AdminUserDtoBuilder dateCreation(LocalDateTime dateCreation) {
            this.dateCreation = dateCreation;
            return this;
        }

        public AdminUserDto build() {
            return new AdminUserDto(publicId, nomComplet, email, paysOrigine, photoProfile, 
                                   favorisIds, role, accountLocked, emailVerified, dateCreation);
        }
    }
}
