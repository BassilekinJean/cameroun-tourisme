package com.cameroun_tour.tourisme.Avis.model;

import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour la mise à jour d'un avis
 * Contient uniquement les champs modifiables
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvisUpdateDto {
    
    @NotNull(message = "L'identifiant de l'avis est requis")
    private UUID publicId;

    @NotBlank(message = "Veuillez saisir un message")
    private String message;

    @Min(value = 1, message = "La note doit être au minimum 1")
    @Max(value = 5, message = "La note doit être au maximum 5")
    private int note;
}
