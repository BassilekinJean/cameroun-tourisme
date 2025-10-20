package com.cameroun_tour.tourisme.voyageur;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserProfileDto(

    @NotBlank(message = "Le nom est obligatoire")
    String nomComplet,

    @NotBlank(message = "L'email est obligatoire !!!")
    @Email(message = "Format d'email invalide !!!")
    String email,

    String paysOrigine,

    @NotBlank(message = "Le mot de passe est obligatoire !!!!")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    String password,

     String photoProfile
) {

}
