package com.cameroun_tour.tourisme.common;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.cameroun_tour.tourisme.common.contracts.AvisDto;
import com.cameroun_tour.tourisme.Avis.AvisServiceApi;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EtablisAvisService {

    private final AvisServiceApi avisService;
   

    public Double getRating(Long etablissementId) {
        return avisService.findAverageRatingByEtablissementId(etablissementId);
    }

    public Page<AvisDto> listerLieu(Long lieuId, PageRequest pageable){
        return avisService.listerLesAvisLieu(lieuId, pageable);
    }

}