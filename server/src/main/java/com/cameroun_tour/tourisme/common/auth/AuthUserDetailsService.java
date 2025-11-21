package com.cameroun_tour.tourisme.common.auth;

import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Interface marqueur qui étend UserDetailsService.
 * Les modules métier (comme 'voyageur') doivent fournir un bean implémentant
 * cette interface pour s'intégrer à la configuration de sécurité globale.
 */
public interface AuthUserDetailsService extends UserDetailsService {
}