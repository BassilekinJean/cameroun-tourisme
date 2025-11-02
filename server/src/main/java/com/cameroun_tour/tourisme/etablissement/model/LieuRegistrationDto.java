package com.cameroun_tour.tourisme.etablissement.model;

import java.util.List;

import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;
import com.cameroun_tour.tourisme.common.utils.validators.ValidPassword;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LieuRegistrationDto(

    @NotBlank(message = "Le nom est obligatoire")
    String nom,

    @NotBlank(message = "Une description est nécessaire")
    String description,

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email incorrecte")
    String email,

    @NotBlank(message = "Veuillez fournir un mot de passe")
    @ValidPassword
    String password,

    @NotBlank(message = "Veuillez valider le mot de passe")
    @ValidPassword
    String validatePassword,

    @NotBlank(message = "Veuillez fourni un numéro de contact")
    String telephone,

    String photoProfile,

    String adresse,

    @NotBlank(message = "Précisez la ville")
    String ville,

    @ElementCollection
    @NotNull(message = "Vous de devez ajouter au moins 1 image des Lieux")
    List<String> images,

    @Enumerated(EnumType.STRING)
    TypeLieu categorie

) {

}
