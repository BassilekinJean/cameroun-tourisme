package com.cameroun_tour.tourisme.etablissement.events;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.cameroun_tour.tourisme.etablissement.api.EtablissementRepository;
import com.cameroun_tour.tourisme.voyageur.events.FavoriToggledEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Écouteur d'événements pour le module Etablissement.
 * Écoute les événements de favori pour mettre à jour le compteur.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EtablissementEventListener {

    private final EtablissementRepository etablissementRepository;

    /**
     * Met à jour le compteur de favoris d'un établissement quand un utilisateur
     * ajoute ou retire l'établissement de ses favoris.
     */
    @EventListener
    @Transactional
    public void onFavoriToggled(FavoriToggledEvent event) {
        etablissementRepository.findByPublicId(event.etablissementPublicId())
            .ifPresent(etablissement -> {
                if (event.wasAdded()) {
                    etablissement.setNombreFavoris(etablissement.getNombreFavoris() + 1);
                } else {
                    etablissement.setNombreFavoris(Math.max(0, etablissement.getNombreFavoris() - 1));
                }
                etablissementRepository.save(etablissement);
                log.debug("Compteur de favoris mis à jour pour l'établissement {}: {}", 
                         event.etablissementPublicId(), etablissement.getNombreFavoris());
            });
    }
}
