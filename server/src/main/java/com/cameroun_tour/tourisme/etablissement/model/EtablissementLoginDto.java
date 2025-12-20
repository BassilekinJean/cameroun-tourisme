package com.cameroun_tour.tourisme.etablissement.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO pour la connexion d'un établissement
 */
public record EtablissementLoginDto(
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    String email,
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    String password
) {}
