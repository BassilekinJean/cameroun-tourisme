package com.cameroun_tour.tourisme.etablissement.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cameroun_tour.tourisme.etablissement.Lieu;

@Repository
public interface EtablissementRepository extends JpaRepository<Lieu, Long>{

}
