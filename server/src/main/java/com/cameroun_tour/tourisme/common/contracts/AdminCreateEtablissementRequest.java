package com.cameroun_tour.tourisme.common.contracts;

import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * DTO pour la création d'un établissement via l'admin.
 * Utilisé pour la communication inter-modules.
 */
public record AdminCreateEtablissementRequest(
    @NotBlank(message = "Le nom est obligatoire")
    String nom,
    
    @NotBlank(message = "La description est obligatoire")
    @Size(min = 10, max = 1000, message = "La description doit contenir entre 10 et 1000 caractères")
    String description,
    
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    String email,
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    String password,
    
    String telephone,
    String photoProfile,
    String adresse,
    
    @NotBlank(message = "La ville est obligatoire")
    String ville,
    
    List<String> images,
    
    @NotNull(message = "La catégorie est obligatoire")
    TypeLieu categorie,
    
    Double latitude,
    Double longitude
) {}
