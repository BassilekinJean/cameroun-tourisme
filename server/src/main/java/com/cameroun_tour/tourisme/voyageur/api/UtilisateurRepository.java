package com.cameroun_tour.tourisme.voyageur.api;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;

@Repository
public interface UtilisateurRepository extends JpaRepository<UtilisateurEntity, Long>{
    Optional<UtilisateurEntity> findByUserEmail(String email);
    Optional<UtilisateurEntity> findByPublicId(UUID publicId);

    /**
     * Recherche d'utilisateurs par nom ou email
     */
    @Query("SELECT u FROM UtilisateurEntity u WHERE " +
           "LOWER(u.nomComplet) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.userEmail) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<UtilisateurEntity> searchUsers(@Param("search") String search, Pageable pageable);
}
