package com.cameroun_tour.tourisme.etablissement;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.cameroun_tour.tourisme.common.contracts.AvisCreationDto;
import com.cameroun_tour.tourisme.common.utils.enums.TypeLieu;
import com.cameroun_tour.tourisme.etablissement.model.LieuRegistrationDto;

public interface EtablissementServiceApi {

    void save(Etablissement etablissement);

    void registerLieu(LieuRegistrationDto dto);

    void publierAvis(Long lieuId, String auteurEmail, AvisCreationDto dto);

    Etablissement trouverAvecId(Long id);

    Etablissement findByPublicId(UUID publicId);

    /**
     * Récupérer tous les établissements avec pagination
     */
    Page<Etablissement> findAll(Pageable pageable);

    /**
     * Récupérer les établissements par catégorie avec pagination
     */
    Page<Etablissement> findByCategorie(TypeLieu categorie, Pageable pageable);

    /**
     * Récupérer les établissements par ville avec pagination
     */
    Page<Etablissement> findByVille(String ville, Pageable pageable);

    /**
     * Recherche textuelle avec filtres optionnels
     */
    Page<Etablissement> search(String query, TypeLieu categorie, String ville, Pageable pageable);

    /**
     * Récupérer les établissements populaires
     */
    List<Etablissement> findPopular(int limit);
    
}
