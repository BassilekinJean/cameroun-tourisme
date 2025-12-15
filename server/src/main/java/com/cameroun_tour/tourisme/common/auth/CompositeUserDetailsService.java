package com.cameroun_tour.tourisme.common.auth;

import com.cameroun_tour.tourisme.common.EtablissementDetailsService;
import com.cameroun_tour.tourisme.common.VoyageurDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor

public class CompositeUserDetailsService implements UserDetailsService {

    private final VoyageurDetailsService voyageurDetailsService;
    private final EtablissementDetailsService etablissementDetailsService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Essayer de trouver un Voyageur
        try {
            return voyageurDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            // Pas trouvé, on continue
        }

        // 2. Essayer de trouver un Établissement
        return etablissementDetailsService.loadUserByUsername(username);
    }
}