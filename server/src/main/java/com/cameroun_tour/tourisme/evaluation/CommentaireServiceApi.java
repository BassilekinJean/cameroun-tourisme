package com.cameroun_tour.tourisme.evaluation;

import org.springframework.data.domain.Page;

import com.cameroun_tour.tourisme.evaluation.model.CommentaireDto;
import com.cameroun_tour.tourisme.voyageur.events.CommentairePublieEvent;

public interface CommentaireServiceApi {

    void onCommentairePublie(CommentairePublieEvent event);

    void editCommentaire(CommentaireDto comment);

    void supprimerCommentaire(Long id);

    Page<CommentaireDto> listerLesCommentairesLieu(Long lieuId);
}
