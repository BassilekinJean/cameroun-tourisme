package com.cameroun_tour.tourisme.common.auth;


import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

/**
 * Interface marqueur qui étend AuthenticationSuccessHandler.
 * Les modules métier (comme 'voyageur') doivent fournir un bean implémentant
 * cette interface pour gérer la redirection et la création de session après
 * une authentification OAuth2 réussie.
 */
public interface Oauth2AuthenticationSuccessHandler extends AuthenticationSuccessHandler {
}
