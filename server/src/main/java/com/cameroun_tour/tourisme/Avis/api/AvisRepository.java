package com.cameroun_tour.tourisme.Avis.api;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cameroun_tour.tourisme.Avis.Avis;


@Repository
public interface AvisRepository extends JpaRepository<Avis, Long>{

    Optional<Avis> findByPublicId(UUID publicId);

    Page<Avis> findByAuteur_PublicId(UUID publicId, Pageable pageable);

    Page<Avis> findByLieuConcerne_Id(Long lieuId, Pageable pageable);

    /**
     * Calcule la note moyenne pour un établissement
     */
    @Query("SELECT AVG(a.note) FROM Avis a WHERE a.lieuConcerne.id = :etablissementId")
    Double findAverageRatingByEtablissementId(@Param("etablissementId") Long etablissementId);

    /**
     * Recherche d'avis par contenu ou nom d'auteur
     */
    @Query("SELECT a FROM Avis a WHERE " +
           "LOWER(a.message) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.auteur.nomComplet) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.lieuConcerne.nom) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Avis> searchAvis(@Param("search") String search, Pageable pageable);
}
