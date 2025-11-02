package com.cameroun_tour.tourisme.evaluation;

import org.springframework.data.domain.Page;

import com.cameroun_tour.tourisme.common.events.CommentairePublieEvent;
import com.cameroun_tour.tourisme.evaluation.model.CommentaireDto;

public interface CommentaireServiceApi {

    void onCommentairePublier(CommentairePublieEvent event);

    void editCommentaire(CommentaireDto comment);

    void supprimerCommentaire(Long id);

    Page<CommentaireDto> listerLesCommentairesLieu(Long lieuId);
}
