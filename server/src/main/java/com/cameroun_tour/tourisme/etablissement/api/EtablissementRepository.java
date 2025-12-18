package com.cameroun_tour.tourisme.etablissement.api;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;
import com.cameroun_tour.tourisme.etablissement.Etablissement;

@Repository
public interface EtablissementRepository extends JpaRepository<Etablissement, Long> {

    boolean existsByEmail(String email);

    Optional<Etablissement> findByEmail(String email);

    Optional<Etablissement> findByPublicId(UUID publicId);

    /**
     * Recherche par catégorie avec pagination
     */
    Page<Etablissement> findByCategorie(TypeLieu categorie, Pageable pageable);

    /**
     * Recherche par ville avec pagination
     */
    Page<Etablissement> findByVilleContainingIgnoreCase(String ville, Pageable pageable);

    /**
     * Recherche par catégorie et ville
     */
    Page<Etablissement> findByCategorieAndVilleContainingIgnoreCase(
            TypeLieu categorie, String ville, Pageable pageable);

    /**
     * Recherche textuelle sur nom, description, ville
     */
    @Query("SELECT e FROM Etablissement e WHERE " +
           "LOWER(e.nom) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.ville) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Etablissement> searchByQuery(@Param("query") String query, Pageable pageable);

    /**
     * Recherche textuelle avec filtre par catégorie
     */
    @Query("SELECT e FROM Etablissement e WHERE " +
           "e.categorie = :categorie AND (" +
           "LOWER(e.nom) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.ville) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Etablissement> searchByQueryAndCategorie(
            @Param("query") String query, 
            @Param("categorie") TypeLieu categorie, 
            Pageable pageable);

    /**
     * Recherche textuelle avec filtre par ville
     */
    @Query("SELECT e FROM Etablissement e WHERE " +
           "LOWER(e.ville) = LOWER(:ville) AND (" +
           "LOWER(e.nom) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Etablissement> searchByQueryAndVille(
            @Param("query") String query, 
            @Param("ville") String ville, 
            Pageable pageable);

    /**
     * Récupérer les établissements les plus populaires (par nombre d'avis)
     */
    List<Etablissement> findTopByOrderByNombreFavorisDesc(Pageable pageable);

    /**
     * Compter par catégorie
     */
    long countByCategorie(TypeLieu categorie);
}
