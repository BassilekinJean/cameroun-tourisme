package com.cameroun_tour.tourisme.voyageur.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentaireCreationDto(
    @NotBlank(message = "Le message ne peut pas être vide.")
    @Size(min = 5, max = 500, message = "Le message doit contenir entre 5 et 500 caractères.")
    String message,

    @Min(value = 1, message = "La note doit être au minimum de 1.")
    @Max(value = 5, message = "La note doit être au maximum de 5.")
    int note 
) {

}
