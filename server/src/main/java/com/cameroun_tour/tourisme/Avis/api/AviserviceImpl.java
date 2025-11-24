package com.cameroun_tour.tourisme.Avis.api;

import java.util.NoSuchElementException;
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

    public void editAvis(AvisDto comment) {
        var avis = avisRepository.findByPublicId(comment.publicId());

        if (avis.isEmpty()) {
            throw new CommentNotFoundException("avis Introuvable ou inexistant");
        }

        avis.get().setMessage(comment.message());
        avis.get().setNote(comment.note());

        try {
            var saveAvis =avis.get();
            avisRepository.save(saveAvis);
        } catch (NoSuchElementException e) {
            throw new CommentNotFoundException("avis Introuvable ou inexistant");
        }
    }

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
                        .map(comment -> new AvisDto(
                            comment.getPublicId(),
                            comment.getMessage(),
                            comment.getAuteur().getPhotoProfile(),
                            comment.getAuteur().getNomComplet(),
                            comment.getNote()
                        ));
    }

}
