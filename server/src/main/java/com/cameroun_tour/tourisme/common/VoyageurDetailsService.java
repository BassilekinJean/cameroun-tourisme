package com.cameroun_tour.tourisme.common;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * Interface pour charger les détails d'un Voyageur (utilisateur normal).
 * Implémentée par le module Voyageur.
 */
public interface VoyageurDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
