package com.cameroun_tour.tourisme.voyageur.model;

import com.cameroun_tour.tourisme.common.utils.validators.ValidPassword;
import com.cameroun_tour.tourisme.voyageur.validator.PasswordMatches;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@PasswordMatches
public record UtilisateurRegistrationDto(

    @NotBlank(message = "Le nom est obligatoire")
    String nomComplet,

    @NotBlank(message = "L'email est obligatoire !!!")
    @Email(message = "Format d'email invalide !!!")
    String email,

    String paysOrigine,

    String photoProfile,

    @NotBlank(message = "Le mot de passe est obligatoire !!!")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @ValidPassword
    String password,

    @NotBlank(message = "Veuillez valide le mot de passe !!!!")
    String validatePassword
) {

}