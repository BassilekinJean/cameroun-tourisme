package com.cameroun_tour.tourisme.Avis.model;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.hateoas.RepresentationModel;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false) 
public class AvisDto extends RepresentationModel<AvisDto>{
    private UUID publicId;

    @NotBlank(message = "Veuillez saisir un message")
    private String message;

    String auteurPhoto;
    
    @NotBlank
    String auteurName;

    LocalDate dateCreation;

    int nombreFavoris;

    private @Min(1) @Max(5) int note;
}
