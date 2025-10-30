package com.cameroun_tour.tourisme.evaluation.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cameroun_tour.tourisme.evaluation.Commentaire;

@Repository
public interface CommentaireRepository extends JpaRepository<Commentaire, Long>{

}
