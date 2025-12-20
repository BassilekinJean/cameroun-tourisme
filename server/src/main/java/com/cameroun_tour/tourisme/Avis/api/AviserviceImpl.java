package com.cameroun_tour.tourisme.Avis.api;

import java.util.List;
import java.util.UUID;

import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.cameroun_tour.tourisme.Avis.Avis;
import com.cameroun_tour.tourisme.common.contracts.AvisDto;
import com.cameroun_tour.tourisme.Avis.AvisServiceApi;
import com.cameroun_tour.tourisme.Avis.errors.CommentNotFoundException;
import com.cameroun_tour.tourisme.Avis.model.AvisUpdateDto;
import com.cameroun_tour.tourisme.common.AvisEtablissementService;
import com.cameroun_tour.tourisme.common.contracts.AdminAvisDto;
import com.cameroun_tour.tourisme.common.events.AvisPublieEvent;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.voyageur.UtilisateurService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Tag(name = "Service de gestion des Avis", description = "Se service implémente l'ensemble de la logique métier lié aux Avis")
public class AviserviceImpl implements AvisServiceApi {

    private final AvisRepository avisRepository;
    private final UtilisateurService utilisateurService; 
    private final AvisEtablissementService etablissementProvider;
    

    @Override
    public void save(Avis avis) {
        if (avis == null) {
            throw new IllegalArgumentException("L'avis ne peut pas être null");
        }
        avisRepository.save(avis);
    }

    @EventListener
    @Transactional
    public void onAvisPublier(AvisPublieEvent event) {
        UtilisateurEntity auteur = utilisateurService.findByEmail(event.auteurEmail());
        Etablissement lieu = etablissementProvider.trouverAvecId(event.lieuId());

        Avis avis = new Avis();
        avis.setPublicId(UUID.randomUUID());
        avis.setMessage(event.message());
        avis.setNote(event.note());
        avis.setAuteur(auteur);
        avis.setDateCreation(event.datePublication());
        avis.setLieuConcerne(lieu);

        avisRepository.save(avis);
    }

    @SuppressWarnings("null")
    public void editAvis(UUID auteurUuid, AvisUpdateDto avisDto) {
        var avis = avisRepository.findByPublicId(avisDto.getPublicId())
                .orElseThrow(() -> new CommentNotFoundException("avis Introuvable ou inexistant"));

        if (!avis.getAuteur().getPublicId().equals(auteurUuid)) {
            throw new CommentNotFoundException("Vous ne pouvez pas modifier un avis qui n'est pas le votre");
        }
        avis.setMessage(avisDto.getMessage());
        avis.setNote(avisDto.getNote());
        
        avisRepository.save(avis);
    }

    @SuppressWarnings("null")
    public void supprimerAvis(Long id) {
        var avis = avisRepository.findById(id);
        if (avis.isEmpty()) {
            throw new CommentNotFoundException("avis Introuvable ou inexistant");
        }
        avisRepository.delete(avis.get());
    }

    public Page<AvisDto> listerLesAvisLieu(Long lieuId, PageRequest pageable) {
        return avisRepository.findByLieuConcerne_Id(lieuId, pageable)
                .map(this::toAvisDto);
    }

    /**
     * Convertit une entité Avis en AvisDto
     */
    private AvisDto toAvisDto(Avis avis) {
        return new AvisDto(
            avis.getPublicId(),
            avis.getMessage(),
            avis.getAuteur() != null ? avis.getAuteur().getPhotoProfile() : null,
            avis.getAuteur() != null ? avis.getAuteur().getNomComplet() : null,
            avis.getDateCreation(),
            avis.getNombreLikes(),
            avis.getNote(),
            avis.getNombreLikes(),
            avis.getAuteur().getPublicId(),
            avis.getAuteur().getUserEmail(),
            avis.getLieuConcerne().getPublicId(),
            avis.getLieuConcerne().getNom()
        );
    }
    
    @Override
    public Page<AvisDto> listerLesAvisParPublicId(UUID etablissementPublicId, int page, int size, String sortBy, String sortDir) {
        var sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                                : Sort.by(sortBy).descending();

        var pageable = PageRequest.of(page, size, sort);

        return avisRepository.findByLieuConcerne_PublicId(etablissementPublicId, pageable)
                .map(this::toAvisDto);
    }

    public Page<AvisDto> utilisateurAvis(UUID userPublicId, int page, int size, String sortBy,
            String sortDir) {
                var sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                                : Sort.by(sortBy).descending();
                                                
                var pageable = PageRequest.of(page, size, sort);

                return avisRepository.findByAuteur_PublicId(userPublicId, pageable)
                        .map(avis -> toAvisDto(avis));
    }

    @Override
    @SuppressWarnings("null")
    public void supprimerUserAvis(UUID userId, UUID avisId) {
        var avis = avisRepository.findByPublicId(avisId)
                .filter(a -> a.getAuteur().getPublicId().equals(userId))
                .orElseThrow(() -> new CommentNotFoundException("Avis introuvable ou vous n'êtes pas l'auteur de cet avis"));

        avisRepository.delete(avis);
    }

    @Override
    public Avis getOneAvis(UUID id) {
        var avis = avisRepository.findByPublicId(id);
        if (avis.isEmpty()) {
            throw new CommentNotFoundException("Avis introuvable");
        }
        var a = avis.get();
        return a;
    }

    @Override
    @Transactional
    public void toggleLike(UUID avisPublicId, String userEmail) {
        // 1. Récupérer l'avis
        Avis avis = avisRepository.findByPublicId(avisPublicId)
                .orElseThrow(() -> new EntityNotFoundException("Avis introuvable"));

        // 2. Récupérer l'utilisateur
        UtilisateurEntity user = utilisateurService.findByEmail(userEmail);

        // 3. Logique métier (exactement ce que tu avais dans UtilisateurService)
        if (avis.getUsersWhoLiked().contains(user)) {
            avis.getUsersWhoLiked().remove(user);
            avis.setNombreLikes(Math.max(0, avis.getNombreLikes() - 1));
        } else {
            avis.getUsersWhoLiked().add(user);
            avis.setNombreLikes(avis.getNombreLikes() + 1);
        }

        // 4. Sauvegarder
        avisRepository.save(avis);
    }

    // ==================== MÉTHODES ADMIN ====================

    @Override
    public long countAll() {
        return avisRepository.count();
    }

    @Override
    public Page<AdminAvisDto> searchAvisForAdmin(int page, int size, String sort, String sortDir, String search) {
        Sort sortOrder = sortDir.equalsIgnoreCase("asc") 
            ? Sort.by(sort).ascending() 
            : Sort.by(sort).descending();
        
        PageRequest pageable = PageRequest.of(page, size, sortOrder);
        
        Page<Avis> avisPage;
        if (search != null && !search.isBlank()) {
            avisPage = avisRepository.searchAvis(search, pageable);
        } else {
            avisPage = avisRepository.findAll(pageable);
        }
        
        return avisPage.map(this::toAdminAvisDto);
    }

    @Override
    @Transactional
    public void deleteAvisByPublicId(UUID publicId) {
        Avis avis = avisRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Avis non trouvé avec l'ID: " + publicId));
        avisRepository.delete(avis);
    }

    @Override
    @Transactional
    public int deleteAvisBatch(List<UUID> avisIds) {
        int deleted = 0;
        for (UUID id : avisIds) {
            try {
                deleteAvisByPublicId(id);
                deleted++;
            } catch (Exception e) {
                // Log et continuer
                log.error("Failed to delete avis with ID: {}. Reason: {}", id, e.getMessage());
            }
        }
        return deleted;
    }

    /**
     * Convertit une entité Avis en AdminAvisDto
     */
    private AdminAvisDto toAdminAvisDto(Avis avis) {
        return AdminAvisDto.builder()
                .publicId(avis.getPublicId())
                .message(avis.getMessage())
                .note(avis.getNote())
                .dateCreation(avis.getDateCreation())
                .nombreLikes(avis.getNombreLikes())
                .auteurId(avis.getAuteur() != null ? avis.getAuteur().getPublicId() : null)
                .auteurNom(avis.getAuteur() != null ? avis.getAuteur().getNomComplet() : null)
                .auteurEmail(avis.getAuteur() != null ? avis.getAuteur().getUserEmail() : null)
                .etablissementId(avis.getLieuConcerne() != null ? avis.getLieuConcerne().getPublicId() : null)
                .etablissementNom(avis.getLieuConcerne() != null ? avis.getLieuConcerne().getNom() : null)
                .build();
    }

    @Override
    public Double findAverageRatingByEtablissementId(Long etablissementId) {
        return avisRepository.findAverageRatingByEtablissementId(etablissementId);
    }
}
