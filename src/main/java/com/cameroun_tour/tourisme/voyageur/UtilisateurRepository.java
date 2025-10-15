package com.cameroun_tour.tourisme.voyageur;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long>{

    Optional <Utilisateur> findByUtilisateurEmail(String email);

    void deleteByUtilisateurEmail(String email);

}
