package com.cameroun_tour.tourisme.Avis.api;


import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.cameroun_tour.tourisme.Avis.Avis;
import com.cameroun_tour.tourisme.Avis.model.AvisDto;
import com.cameroun_tour.tourisme.Avis.model.AvisUpdateDto;

@Component
public class AvisModelAssembler extends RepresentationModelAssemblerSupport<Avis, AvisDto> {

    public AvisModelAssembler() {
        super(AvisController.class, AvisDto.class);
    }

    @NonNull
    @Override
    @SuppressWarnings("null")
    public AvisDto toModel(@NonNull Avis entity) {
        AvisDto dto = AvisDto.builder()
                .publicId(entity.getPublicId())
                .message(entity.getMessage())
                .note(entity.getNote())
                .dateCreation(entity.getDateCreation())
                .nombreFavoris(entity.getNombreLikes())
                .auteurName(entity.getAuteur().getNomComplet())
                .auteurPhoto(entity.getAuteur().getPhotoProfile())
                .build();

        // Créer un AvisUpdateDto pour le lien HATEOAS
        AvisUpdateDto updateDto = AvisUpdateDto.builder()
                .publicId(entity.getPublicId())
                .message(entity.getMessage())
                .note(entity.getNote())
                .build();
        
        dto.add(linkTo(methodOn(AvisController.class).modifierUnAvis(updateDto)).withSelfRel());
        dto.add(linkTo(methodOn(AvisController.class).supprimerMonAvis(entity.getPublicId())).withRel("delete"));

        return dto;
    }
}