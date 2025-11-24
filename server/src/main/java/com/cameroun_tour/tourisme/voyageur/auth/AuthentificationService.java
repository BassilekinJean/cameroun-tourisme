package com.cameroun_tour.tourisme.voyageur.auth;

import org.springframework.security.oauth2.core.user.OAuth2User;

import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurLoginDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurRegistrationDto;

public interface AuthentificationService {

    public record AuthResult(UtilisateurDto user, String accessToken, String refreshToken) {}

    AuthResult register(UtilisateurRegistrationDto request);

    AuthResult processOAuth2User(OAuth2User oauth2User);

    AuthResult login(UtilisateurLoginDto request);

    void logout(String accessToken, String refreshToken);

    String refreshToken(String refreshToken);

    UtilisateurDto convertFromEntity(UtilisateurEntity user);
}
