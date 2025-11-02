package com.cameroun_tour.tourisme.etablissement;

import com.cameroun_tour.tourisme.common.contracts.CommentaireCreationDto;
import com.cameroun_tour.tourisme.etablissement.model.LieuRegistrationDto;

public interface EtablissementServiceApi {

    void registerLieu(LieuRegistrationDto dto);

    void publierCommentaire(Long lieuId, String auteurEmail, CommentaireCreationDto dto);

    Lieu findById(Long id);
    
}
