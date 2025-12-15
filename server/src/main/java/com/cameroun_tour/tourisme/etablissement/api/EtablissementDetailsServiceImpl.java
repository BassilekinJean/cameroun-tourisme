package com.cameroun_tour.tourisme.etablissement.api;

import com.cameroun_tour.tourisme.common.EtablissementDetailsService;
import com.cameroun_tour.tourisme.common.utils.enums.Role;
import com.cameroun_tour.tourisme.etablissement.Etablissement;

import lombok.RequiredArgsConstructor;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Service d'authentification spécifique aux établissements.
 * Implémente EtablissementDetailsService pour être injectable dans le module common.
 */
@Service
@RequiredArgsConstructor
public class EtablissementDetailsServiceImpl implements EtablissementDetailsService {

    private final EtablissementRepository etablissementRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Etablissement etablissement = etablissementRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Établissement non trouvé avec l'email: " + username));

        // Création d'un UserDetails à partir de l'Etablissement
        return new User(
                etablissement.getEmail(),
                etablissement.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + Role.ETABLISSEMENT.name()))
        );
    }
}
