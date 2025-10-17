package com.cameroun_tour.tourisme.voyageur.model;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.annotations.CurrentTimestamp;

import com.cameroun_tour.tourisme.common.utils.Role;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;


@Data
@Entity
public class UtilisateurEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Veuillez fournir le champ nomComplet")
    private String nomComplet;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "L'email est vide !!!!")
    @Email(message = "Format d'email invalide")
    private String userEmail;

    @Column(nullable = false)
    @NotBlank(message = "Le mot de passe est vide !!!!")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String userPassword;

    private String paysOrigine;

    private String photoProfile;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @ElementCollection
    private List<String> listeDesFavoris;

    @CurrentTimestamp
    @Column(updatable = false)
    private Timestamp dateCreation;

}
