package com.cameroun_tour.tourisme.evaluation.api;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.cameroun_tour.tourisme.evaluation.Commentaire;
import com.cameroun_tour.tourisme.evaluation.CommentaireServiceApi;
import com.cameroun_tour.tourisme.evaluation.errors.CommentNotFoundException;
import com.cameroun_tour.tourisme.evaluation.model.CommentaireDto;
import com.cameroun_tour.tourisme.voyageur.UserService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.events.CommentairePublieEvent;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Tag(name = "Service de gestion des Commentaires", description = "Se service implémente l'ensemble de la logique métier lié aux commentaires")
public class CommentaireServiceImpl implements CommentaireServiceApi {

    private final CommentaireRepository commentaireRepository;
    private final UserService utilisateurService; // Pour récupérer l'entité auteur

    public void onCommentairePublie(CommentairePublieEvent event) {
        // Logique pour sauvegarder le commentaire
        UtilisateurEntity auteur = utilisateurService.findByEmail(event.auteurEmail());

        Commentaire commentaire = new Commentaire();
        commentaire.setMessage(event.message());
        commentaire.setNote(event.note());
        commentaire.setAuteur(auteur);
        commentaire.setDateCreation(event.datePublication());
        // Associer le commentaire à l'établissement via event.etablissementId()

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
    public Page<CommentaireDto> listerLesCommentairesLieu(Long lieuId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'listerLesCommentairesLieu'");
    }
}
