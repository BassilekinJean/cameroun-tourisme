package com.cameroun_tour.tourisme.evaluation;

import java.time.LocalDateTime;

import com.cameroun_tour.tourisme.etablissement.Lieu;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Commentaire {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	@NotBlank(message = "Veuillez saisir un message")
	private String message;

	@Min(1) @Max(5) private int note;

	@NotNull
	@ManyToOne
	@JoinColumn(name = "utilisateur_entity_id", nullable = false)
	private UtilisateurEntity auteur;

	@NotNull
	@ManyToOne
	@JoinColumn(name = "lieu_id")
	private Lieu lieuConcerne;

	private LocalDateTime dateCreation = LocalDateTime.now();

}
