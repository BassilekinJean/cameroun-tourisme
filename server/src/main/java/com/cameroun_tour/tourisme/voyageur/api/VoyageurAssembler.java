package com.cameroun_tour.tourisme.voyageur.api;

import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class VoyageurAssembler extends RepresentationModelAssemblerSupport<UtilisateurEntity, VoyageurResponse> {

    public VoyageurAssembler() {
        super(UtilisateurController.class, VoyageurResponse.class);
    }
    
    @Override
    @NonNull
    public VoyageurResponse toModel(@NonNull UtilisateurEntity entity) {
        VoyageurResponse model = instantiateModel(entity);
        
        model.setId(entity.getPublicId());
        model.setNomComplet(entity.getNomComplet());
        model.setEmail(entity.getUserEmail());
        model.setPaysOrigine(entity.getPaysOrigine());
        model.setPhotoProfile(entity.getPhotoProfile());

        model.add(linkTo(methodOn(UtilisateurController.class).getProfileWithId(entity.getPublicId())).withSelfRel());
        model.add(linkTo(methodOn(UtilisateurController.class).listerTousLesUsers(0, 10, "id", "asc", null)).withRel("users"));
        
        return model;
    }
}

