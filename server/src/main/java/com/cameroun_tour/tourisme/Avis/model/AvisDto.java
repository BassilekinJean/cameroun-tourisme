package com.cameroun_tour.tourisme.Avis.model;

import java.util.UUID;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record AvisDto(

    UUID publicId,

    @NotBlank(message = "Veuillez saisir un message")
    String message,

    String auteurPhoto,
    
    @NotBlank
    String auteurName,

    @Min(1) @Max(5) int note
) {

}
