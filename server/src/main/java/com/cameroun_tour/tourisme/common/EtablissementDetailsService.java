package com.cameroun_tour.tourisme.common;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * Interface pour charger les détails d'un Établissement (hôtel, restaurant, etc.).
 * Implémentée par le module Etablissement.
 */
public interface EtablissementDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
