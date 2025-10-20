package com.cameroun_tour.tourisme.voyageur.model;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.cameroun_tour.tourisme.common.utils.Role;
import com.cameroun_tour.tourisme.common.utils.validators.ValidPassword;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nomComplet;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String userEmail;

    @Column(nullable = false)
    @NotBlank(message = "Le mot de passe est obligatoire")
    @ValidPassword
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
    private LocalDateTime dateCreation;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
