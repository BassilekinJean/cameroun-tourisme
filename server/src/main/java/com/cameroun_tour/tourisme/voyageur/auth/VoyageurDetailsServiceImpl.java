package com.cameroun_tour.tourisme.voyageur.auth;

import com.cameroun_tour.tourisme.common.auth.AuthUserDetailsService;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.api.UtilisateurRepository;

import lombok.RequiredArgsConstructor;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoyageurDetailsServiceImpl implements AuthUserDetailsService {

    private final UtilisateurRepository utilisateurRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Le "username" pour Spring Security est notre email
        UtilisateurEntity utilisateur = utilisateurRepository.findByUserEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + username));
        return new org.springframework.security.core.userdetails.User(
            utilisateur.getUserEmail(),
            utilisateur.getUserPassword(),
            Collections.singletonList(new SimpleGrantedAuthority(utilisateur.getRole().toString()))
        );
    }
}