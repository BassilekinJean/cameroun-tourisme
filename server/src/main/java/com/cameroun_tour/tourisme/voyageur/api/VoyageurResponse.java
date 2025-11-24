package com.cameroun_tour.tourisme.voyageur.api;

import java.util.UUID;

import org.springframework.hateoas.RepresentationModel;

//import com.cameroun_tour.tourisme.evaluation.model.CommentaireDto;

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
public class VoyageurResponse extends RepresentationModel<VoyageurResponse> {
    private UUID id;
    private String nomComplet;
    private String email;
    private String paysOrigine;
    private String photoProfile;
}
