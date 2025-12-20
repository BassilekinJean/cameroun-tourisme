package com.cameroun_tour.tourisme.common.contracts;

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

    private String auteurPhoto;
    
    @NotBlank
    private String auteurName;

    private LocalDate dateCreation;

    private int nombreFavoris;

    private @Min(1) @Max(5) int note;

    private int nombreLikes;

    private UUID auteurId;

    private String auteurEmail;

    private UUID etablissementId;
    
    private String etablissementNom;
}
