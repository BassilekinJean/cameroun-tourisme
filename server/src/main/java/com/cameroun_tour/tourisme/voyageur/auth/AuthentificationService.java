package com.cameroun_tour.tourisme.voyageur.auth;

import org.springframework.security.oauth2.core.user.OAuth2User;

import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurLoginDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurRegistrationDto;
import com.cameroun_tour.tourisme.voyageur.model.ResetPasswordDto;

public interface AuthentificationService {

    public record AuthResult(UtilisateurDto user, String accessToken, String refreshToken) {}

    AuthResult register(UtilisateurRegistrationDto request);

    AuthResult processOAuth2User(OAuth2User oauth2User);

    AuthResult login(UtilisateurLoginDto request);

    void logout(String accessToken, String refreshToken);

    String refreshToken(String refreshToken);

    UtilisateurDto convertFromEntity(UtilisateurEntity user);
    
    /**
     * Envoie un code OTP pour la vérification d'email lors de l'inscription
     * Vérifie que l'email n'est pas déjà utilisé
     * @param email L'email de l'utilisateur
     */
    void sendOtpForRegistration(String email);
    
    /**
     * Envoie un code OTP pour la réinitialisation du mot de passe
     * Vérifie que l'email existe dans la base de données
     * @param email L'email de l'utilisateur
     */
    void sendOtpForPasswordReset(String email);
    
    /**
     * Vérifie un code OTP
     * @param email L'email de l'utilisateur
     * @param otp Le code OTP à vérifier
     */
    void verifyOtp(String email, String otp);
    
    /**
     * Réinitialise le mot de passe avec vérification OTP
     * @param request Les données de réinitialisation
     */
    void resetPassword(ResetPasswordDto request);
}
