package com.cameroun_tour.tourisme.voyageur.model;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record UtilisateurProfileDto(

    //String id,

    @NotBlank(message = "Le nom est obligatoire")
    String nomComplet,

    @NotBlank(message = "L'email est obligatoire !!!")
    @Email(message = "Format d'email invalide !!!")
    String email,

    @NotBlank(message = "Le pays d'origine est obligatoire")
    String paysOrigine,

    String photoProfile
) {

}
