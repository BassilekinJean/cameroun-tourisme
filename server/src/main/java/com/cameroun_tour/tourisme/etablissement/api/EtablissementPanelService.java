package com.cameroun_tour.tourisme.etablissement.api;

import java.util.Map;

import org.springframework.data.domain.Page;

import com.cameroun_tour.tourisme.common.contracts.AvisDto;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.model.EtablissementUpdateDto;

public interface EtablissementPanelService {
    
    /**
     * Récupère l'établissement par l'email du propriétaire
     */
    Etablissement getEtablissementByOwnerEmail(String email);
    
    /**
     * Récupère les statistiques de l'établissement
     */
    Map<String, Object> getEtablissementStats(String ownerEmail);
    
    /**
     * Met à jour l'établissement
     */
    Etablissement updateEtablissement(String ownerEmail, EtablissementUpdateDto dto);
    
    /**
     * Récupère les avis de l'établissement
     */
    Page<AvisDto> getEtablissementAvis(String ownerEmail, int page, int size, String sort, String sortDir);
}
