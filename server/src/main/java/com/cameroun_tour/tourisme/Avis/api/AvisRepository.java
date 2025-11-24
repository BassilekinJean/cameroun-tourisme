package com.cameroun_tour.tourisme.Avis.api;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cameroun_tour.tourisme.Avis.Avis;


@Repository
public interface AvisRepository extends JpaRepository<Avis, Long>{

    Optional<Avis> findByPublicId(UUID publicId);

    Page<Avis> findByAuteur_PublicId(UUID publicId, Pageable pageable);

    Page<Avis> findByLieuConcerne_Id(Long lieuId, Pageable pageable);
}
