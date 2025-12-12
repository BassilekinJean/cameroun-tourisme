package com.cameroun_tour.tourisme.etablissement;

import java.util.List;

import com.cameroun_tour.tourisme.common.contracts.AvisCreationDto;
import com.cameroun_tour.tourisme.etablissement.model.LieuRegistrationDto;

public interface EtablissementServiceApi {

    void save(Etablissement etablissement);

    void registerLieu(LieuRegistrationDto dto);

    void publierAvis(Long lieuId, String auteurEmail, AvisCreationDto dto);

    Etablissement trouverAvecId(Long id);
    
}
