package com.cameroun_tour.tourisme.Avis;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.cameroun_tour.tourisme.Avis.model.AvisDto;
import com.cameroun_tour.tourisme.Avis.model.AvisUpdateDto;
import com.cameroun_tour.tourisme.common.contracts.AdminAvisDto;
import com.cameroun_tour.tourisme.common.events.AvisPublieEvent;

public interface AvisServiceApi {

    void toggleLike(UUID avisPublicId, String userEmail);

    void save(Avis avis);

    Avis getOneAvis(UUID id);

    void onAvisPublier(AvisPublieEvent event);

    void editAvis(UUID auteurId, AvisUpdateDto comment);

    void supprimerAvis(Long id);

    void supprimerUserAvis(UUID userId, UUID avisId);

    Page<Avis> listerLesAvisLieu(Long lieuId, int page, int size, String sortBy, String sortDir);

    /**
     * Liste les avis d'un établissement par son publicId (UUID)
     */
    Page<Avis> listerLesAvisParPublicId(UUID etablissementPublicId, int page, int size, String sortBy, String sortDir);

    Page<AvisDto> utilisateurAvis(UUID userId, int page, int size, String sortBy, String sortDir);

    // ==================== MÉTHODES ADMIN ====================

    /**
     * Compte total des avis
     */
    long countAll();

    /**
     * Recherche paginée des avis pour l'admin
     */
    Page<AdminAvisDto> searchAvisForAdmin(int page, int size, String sort, String sortDir, String search);

    /**
     * Suppression d'un avis par son ID public (admin)
     */
    void deleteAvisByPublicId(UUID publicId);

    /**
     * Suppression en lot d'avis
     */
    int deleteAvisBatch(List<UUID> avisIds);
}
