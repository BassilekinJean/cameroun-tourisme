package com.cameroun_tour.tourisme.Avis;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.cameroun_tour.tourisme.Avis.model.AvisDto;
import com.cameroun_tour.tourisme.common.events.AvisPublieEvent;

public interface AvisServiceApi {

    void toggleLike(UUID avisPublicId, String userEmail);

    void save(Avis avis);

    Avis getOneAvis(UUID id);

    void onAvisPublier(AvisPublieEvent event);

    void editAvis(UUID auteurId ,AvisDto comment);

    void supprimerAvis(Long id);

    void supprimerUserAvis(UUID userId, UUID avisId);

    Page<Avis> listerLesAvisLieu(Long lieuId, int page, int size, String sortBy, String sortDir);

    Page<AvisDto> utilisateurAvis(UUID userId, int page, int size, String sortBy, String sortDir);
}
