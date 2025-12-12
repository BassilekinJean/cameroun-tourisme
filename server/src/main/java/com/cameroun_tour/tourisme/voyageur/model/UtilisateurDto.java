package com.cameroun_tour.tourisme.voyageur.model;


import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UtilisateurDto(

    UUID publicId,

    @NotBlank(message = "Le nom est obligatoire")
    String nomComplet,

    @NotBlank(message = "L'email est obligatoire !!!")
    @Email(message = "Format d'email invalide !!!")
    String email,

    @NotBlank(message = "Le pays d'origine est obligatoire")
    String paysOrigine,

    String photoProfile,

    Set<UUID> favorisIds

) {
    public UtilisateurDto {
        if (favorisIds == null) {
            favorisIds = new HashSet<>();
        }
    }
}
