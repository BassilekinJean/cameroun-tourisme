package com.cameroun_tour.tourisme.evaluation.api;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cameroun_tour.tourisme.evaluation.model.Commentaire;

public interface CommentaireRepository extends JpaRepository<Commentaire, Long>{

}
