package com.cameroun_tour.tourisme.voyageur.api;

import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.model.VoyageurResponse;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class VoyageurAssembler extends RepresentationModelAssemblerSupport<UtilisateurEntity, VoyageurResponse> {

    public VoyageurAssembler() {
        super(UtilisateurController.class, VoyageurResponse.class);
    }
    
    @Override
    @NonNull
    @SuppressWarnings("null")
    public VoyageurResponse toModel(@NonNull UtilisateurEntity entity) {
        VoyageurResponse model = instantiateModel(entity);
        
        model.setId(entity.getPublicId());
        model.setNomComplet(entity.getNomComplet());
        model.setEmail(entity.getUserEmail());
        model.setPaysOrigine(entity.getPaysOrigine());
        model.setPhotoProfile(entity.getPhotoProfile());
        model.setFavorisIds(entity.getFavoris().stream().map(fav -> fav.getPublicId()).collect(java.util.stream.Collectors.toSet()));


        model.add(linkTo(methodOn(UtilisateurController.class).getProfileWithId(entity.getPublicId())).withSelfRel());
        
        
        return model;
    }
}

