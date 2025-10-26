package com.cameroun_tour.tourisme.voyageur;

import com.cameroun_tour.tourisme.common.utils.validators.ValidPassword;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserProfileDto(

    @NotBlank(message = "Le nom est obligatoire")
    String nomComplet,

    @NotBlank(message = "L'email est obligatoire !!!")
    @Email(message = "Format d'email invalide !!!")
    String email,

    @NotBlank(message = "Le pays d'origine est obligatoire")
    String paysOrigine,

    @NotBlank(message = "Le mot de passe est obligatoire !!!!")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @ValidPassword
    String password,

    String photoProfile
) {

}
