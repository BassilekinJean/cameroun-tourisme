package com.cameroun_tour.tourisme.voyageur.auth;

import com.cameroun_tour.tourisme.common.auth.AuthUserDetailsService;
import com.cameroun_tour.tourisme.common.utils.enums.Role;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.api.EtablissementRepository;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.api.UtilisateurRepository;

import lombok.RequiredArgsConstructor;

import java.util.Collections;
import java.util.Optional;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoyageurDetailsServiceImpl implements AuthUserDetailsService {

    private final UtilisateurRepository utilisateurRepository;
    private final EtablissementRepository etablissementRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Le "username" pour Spring Security est notre email
        Optional<UtilisateurEntity> utilisateur = utilisateurRepository.findByUserEmail(username);
        
        if (utilisateur.isPresent()) {
            return utilisateur.get();
        }

        Etablissement etablissement = etablissementRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + username));

        return new org.springframework.security.core.userdetails.User(
            etablissement.getEmail(),
            etablissement.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority(Role.ETABLISSEMENT.toString()))
        );
    }
}