package com.cameroun_tour.tourisme.common;

import org.springframework.stereotype.Component;

import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class AvisEtablissementService {

    private final EtablissementServiceApi etablissementService;

    public Etablissement trouverAvecId(Long id){
        return etablissementService.trouverAvecId(id);
    }
}
