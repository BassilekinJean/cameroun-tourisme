package com.cameroun_tour.tourisme.voyageur.auth;

import org.springframework.security.oauth2.core.user.OAuth2User;

import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.model.UserLoginDto;
import com.cameroun_tour.tourisme.voyageur.model.UserProfileDto;
import com.cameroun_tour.tourisme.voyageur.model.UserRegistrationDto;

public interface AuthentificationService {

    public record AuthResult(UserProfileDto user, String accessToken, String refreshToken) {}

    AuthResult register(UserRegistrationDto request);

    AuthResult processOAuth2User(OAuth2User oauth2User);

    AuthResult login(UserLoginDto request);

    void logout(String accessToken, String refreshToken);

    String refreshToken(String refreshToken);

    UserProfileDto convertFromEntity(UtilisateurEntity user);
}
