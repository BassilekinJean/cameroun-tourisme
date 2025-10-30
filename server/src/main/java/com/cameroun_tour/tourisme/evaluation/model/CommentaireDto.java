package com.cameroun_tour.tourisme.evaluation.model;

import com.cameroun_tour.tourisme.voyageur.UtilisateurCardDto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommentaireDto(

    Long id,

    @NotBlank(message = "Veuillez saisir un message")
    String message,

    @NotNull(message = "Un commentaire dois avoir un auteur")
    UtilisateurCardDto auteur,

    @Min(1) @Max(5) int note
) {

}
