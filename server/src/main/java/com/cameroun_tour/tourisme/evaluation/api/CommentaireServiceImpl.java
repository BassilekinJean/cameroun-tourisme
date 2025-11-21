package com.cameroun_tour.tourisme.evaluation.api;

import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.cameroun_tour.tourisme.common.events.CommentairePublieEvent;
import com.cameroun_tour.tourisme.etablissement.EtablissementServiceApi;
import com.cameroun_tour.tourisme.etablissement.Lieu;
import com.cameroun_tour.tourisme.evaluation.Commentaire;
import com.cameroun_tour.tourisme.evaluation.CommentaireServiceApi;
import com.cameroun_tour.tourisme.evaluation.errors.CommentNotFoundException;
import com.cameroun_tour.tourisme.evaluation.model.CommentaireDto;
import com.cameroun_tour.tourisme.voyageur.UserService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Tag(name = "Service de gestion des Commentaires", description = "Se service implémente l'ensemble de la logique métier lié aux commentaires")
public class CommentaireServiceImpl implements CommentaireServiceApi {

    private final CommentaireRepository commentaireRepository;
    private final UserService utilisateurService; 
    private final EtablissementServiceApi etablissementService;

    @Override
    @EventListener
    public void onCommentairePublier(CommentairePublieEvent event) {
        UtilisateurEntity auteur = utilisateurService.findByEmail(event.auteurEmail());
        Lieu lieu = etablissementService.findById(event.lieuId());

        Commentaire commentaire = new Commentaire();
        commentaire.setMessage(event.message());
        commentaire.setNote(event.note());
        commentaire.setAuteur(auteur);
        commentaire.setDateCreation(event.datePublication());
        commentaire.setLieuConcerne(lieu);

        commentaireRepository.save(commentaire);
    }

    @Override
    public void editCommentaire(CommentaireDto comment) {
        var commentaire = commentaireRepository.findById(comment.id());

        if (commentaire.isEmpty()) {
            throw new CommentNotFoundException("Commentaire Introuvable ou inexistant");
        }

        commentaire.get().setMessage(comment.message());
        commentaire.get().setNote(comment.note());

        commentaireRepository.save(commentaire.get());
    }

    @Override
    public void supprimerCommentaire(Long id) {
        var commentaire = commentaireRepository.findById(id);
        if (commentaire.isEmpty()) {
            throw new CommentNotFoundException("Commentaire Introuvable ou inexistant");
        }
        commentaireRepository.delete(commentaire.get());
    }

    @Override
    public Page<Commentaire> listerLesCommentairesLieu(Long lieuId, int page, int size, String sortBy, String sortDir) {
        var sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                                : Sort.by(sortBy).descending();

        var pageable = PageRequest.of(page, size, sort);

        return commentaireRepository.findAll(pageable);
    }

}
