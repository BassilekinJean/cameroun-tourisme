package com.cameroun_tour.tourisme.admin;

import java.sql.Timestamp;

import org.hibernate.annotations.CurrentTimestamp;

import com.cameroun_tour.tourisme.common.utils.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
@Table(name = "Administrateur")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Veuillez fournir le champ nomComplet")
    private String nomComplet;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "L'email est vide !!!!")
    @Email(message = "Format d'email invalide")
    private String adminEmail;

    @Column(nullable = false)
    @NotBlank(message = "Le mot de passe est vide !!!!")
    @Size(min = 12, message = "Le mot de passe doit contenir au moins 12 caractères")
    private String adminPassword;

    private String scope;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ADMIN;

    @CurrentTimestamp
    @Column(updatable = false)
    private Timestamp dateCreation;

}
