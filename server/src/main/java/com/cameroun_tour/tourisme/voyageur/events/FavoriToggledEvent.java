package com.cameroun_tour.tourisme.voyageur.events;

import java.util.UUID;

/**
 * Événement émis lorsqu'un utilisateur ajoute ou retire un établissement de ses favoris.
 * Le module Etablissement écoute cet événement pour mettre à jour son compteur.
 * 
 * @param etablissementPublicId L'UUID public de l'établissement concerné
 * @param wasAdded true si le favori a été ajouté, false s'il a été retiré
 */
public record FavoriToggledEvent(
    UUID etablissementPublicId,
    boolean wasAdded
) {}
