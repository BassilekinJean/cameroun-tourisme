package com.cameroun_tour.tourisme.Avis;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class Avis {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique=true, nullable = false, updatable = false)
	private UUID publicId;

	@Column(nullable = false)
	@NotBlank(message = "Veuillez saisir un message")
	private String message;

	@Min(1) @Max(5) private int note;

	@Column(nullable = false)
    private int nombreLikes = 0;

	@ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private UtilisateurEntity auteur;

    @ManyToMany
    @JoinTable(
        name = "avis_likes",
        joinColumns = @JoinColumn(name = "avis_id"),
        inverseJoinColumns = @JoinColumn(name = "utilisateur_id")
    )
    private Set<UtilisateurEntity> usersWhoLiked;

    @ManyToOne
    @JoinColumn(name = "etablissement_id", nullable = false)
    private Etablissement lieuConcerne;

	private LocalDate dateCreation;
}
