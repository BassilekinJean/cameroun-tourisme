package com.cameroun_tour.tourisme.etablissement;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.cameroun_tour.tourisme.Avis.Avis;
import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
public class Etablissement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Une description est nécessaire")
    private String description;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email incorrecte")
    private String email;

    @NotBlank(message = "Veuillez fournir un mot de passe")
    private String password;

    @NotBlank(message = "Veuillez fourni un numéro de contact")
    private String telephone;

    private String photoProfile;

    private String adresse;

    @NotBlank(message = "Précisez la ville")
    private String ville;

    @ElementCollection
    @NotNull(message = "Vous de devez ajouter au moins 1 image des Lieux")
    private List<String> images;

    @OneToMany(mappedBy = "lieuConcerne", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Avis> avis = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private TypeLieu categorie;

    @CurrentTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
