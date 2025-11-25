package com.cameroun_tour.tourisme.Avis.api;

import java.util.UUID;

import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.cameroun_tour.tourisme.Avis.Avis;
import com.cameroun_tour.tourisme.Avis.AvisServiceApi;
import com.cameroun_tour.tourisme.Avis.errors.CommentNotFoundException;
import com.cameroun_tour.tourisme.Avis.model.AvisDto;
import com.cameroun_tour.tourisme.common.events.AvisPublieEvent;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.voyageur.UtilisateurService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Tag(name = "Service de gestion des Avis", description = "Se service implémente l'ensemble de la logique métier lié aux Avis")
public class AviserviceImpl implements AvisServiceApi {

    private final AvisRepository avisRepository;
    private final UtilisateurService utilisateurService; 
    private final EtablissementServiceApi etablissementService;


    @EventListener
    @Transactional
    public void onAvisPublier(AvisPublieEvent event) {
        UtilisateurEntity auteur = utilisateurService.findByEmail(event.auteurEmail());
        Etablissement lieu = etablissementService.trouverAvecId(event.lieuId());

        Avis avis = new Avis();
        avis.setMessage(event.message());
        avis.setNote(event.note());
        avis.setAuteur(auteur);
        avis.setDateCreation(event.datePublication());
        avis.setLieuConcerne(lieu);

        avisRepository.save(avis);
    }

    @SuppressWarnings("null")
    public void editAvis(UUID auteurUuid ,AvisDto avisDto) {
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

    public Page<Avis> listerLesAvisLieu(Long lieuId, int page, int size, String sortBy, String sortDir) {
        var sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                                : Sort.by(sortBy).descending();

        var pageable = PageRequest.of(page, size, sort);

        return avisRepository.findAll(pageable);
    }

    public Page<AvisDto> utilisateurAvis(UUID userPublicId, int page, int size, String sortBy,
            String sortDir) {
                var sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                                : Sort.by(sortBy).descending();
                                                
                var pageable = PageRequest.of(page, size, sort);

                return avisRepository.findByAuteur_PublicId(userPublicId, pageable)
                        .map(avis -> new AvisDto(
                            avis.getPublicId(),
                            avis.getMessage(),
                            avis.getAuteur().getPhotoProfile(),
                            avis.getAuteur().getNomComplet(),
                            avis.getDateCreation(),
                            avis.getNote()
                        ));
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
}
