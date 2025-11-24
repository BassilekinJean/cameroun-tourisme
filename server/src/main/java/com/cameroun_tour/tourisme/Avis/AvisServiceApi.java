package com.cameroun_tour.tourisme.Avis;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.cameroun_tour.tourisme.Avis.model.AvisDto;
import com.cameroun_tour.tourisme.common.events.AvisPublieEvent;

public interface AvisServiceApi {

    void onAvisPublier(AvisPublieEvent event);

    void editAvis(AvisDto comment);

    void supprimerAvis(Long id);

    Page<Avis> listerLesAvisLieu(Long lieuId, int page, int size, String sortBy, String sortDir);

    Page<AvisDto> utilisateurAvis(UUID userId, int page, int size, String sortBy, String sortDir);
}
