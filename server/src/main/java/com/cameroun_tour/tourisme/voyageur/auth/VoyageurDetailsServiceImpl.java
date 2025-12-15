package com.cameroun_tour.tourisme.voyageur.auth;

import com.cameroun_tour.tourisme.common.VoyageurDetailsService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.api.UtilisateurRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Service d'authentification spécifique aux voyageurs.
 * Implémente VoyageurDetailsService pour être injectable dans le module common.
 */
@Service
@RequiredArgsConstructor
public class VoyageurDetailsServiceImpl implements VoyageurDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Le "username" pour Spring Security est notre email
        UtilisateurEntity utilisateur = utilisateurRepository.findByUserEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Voyageur non trouvé avec l'email: " + username));
        
        return utilisateur;
    }
}