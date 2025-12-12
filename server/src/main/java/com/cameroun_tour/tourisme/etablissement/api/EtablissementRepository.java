package com.cameroun_tour.tourisme.etablissement.api;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cameroun_tour.tourisme.etablissement.Etablissement;

@Repository
public interface EtablissementRepository extends JpaRepository<Etablissement, Long>{

    boolean existsByEmail(String email);

    Optional<Etablissement> findByEmail(String email);

    Optional<Etablissement> findByPublicId(java.util.UUID publicId);
}
