package com.cameroun_tour.tourisme.voyageur.api;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cameroun_tour.tourisme.voyageur.model.UtilisateurEntity;

@Repository
public interface UtilisateurRepository extends JpaRepository<UtilisateurEntity, Long>{
    Optional<UtilisateurEntity> findByUserEmail(String email);

}
