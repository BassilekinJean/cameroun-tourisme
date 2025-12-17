package com.cameroun_tour.tourisme.voyageur.auth.api;


import com.cameroun_tour.tourisme.common.auth.CookieUtil;
import com.cameroun_tour.tourisme.voyageur.auth.AuthentificationService;
import com.cameroun_tour.tourisme.voyageur.model.OtpRequestDto;
import com.cameroun_tour.tourisme.voyageur.model.OtpVerificationDto;
import com.cameroun_tour.tourisme.voyageur.model.ResetPasswordDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurLoginDto; 
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurRegistrationDto;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "Endpoints pour l'authentification")
public class AuthController {

    private final AuthentificationService authService;
    private final CookieUtil cookieUtil;

    @Value("${jwt.access-token.cookie-name}") private String accessTokenCookieName;
    @Value("${jwt.refresh-token.cookie-name}") private String refreshTokenCookieName;
    @Value("${jwt.access-token-expiration}") private long accessTokenExpirationMs;
    @Value("${jwt.refresh-token-expiration}") private long refreshTokenExpirationMs;


    @PostMapping("/register")
    @RateLimiter(name = "registerRateLimiter")
    public ResponseEntity<UtilisateurDto> register(
            @Valid @RequestBody UtilisateurRegistrationDto request, 
            HttpServletResponse response
    ) {
        AuthServiceImpl.AuthResult result = authService.register(request);
        addTokensToCookies(response, result.accessToken(), result.refreshToken());
        
        return ResponseEntity.ok(result.user());
    }

    @PostMapping("/login")
    @RateLimiter(name = "loginRateLimiter")
    public ResponseEntity<UtilisateurDto> login(
            @Valid @RequestBody UtilisateurLoginDto request,
            HttpServletResponse response
    ) {
        AuthServiceImpl.AuthResult result = authService.login(request);
        addTokensToCookies(response, result.accessToken(), result.refreshToken());
        
        return ResponseEntity.ok(result.user());
    }

    @PostMapping("/refresh")
    @RateLimiter(name = "refreshRateLimiter")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractTokenFromCookie(request, refreshTokenCookieName);
        if (refreshToken == null) {
            return ResponseEntity.status(401).body("Refresh token non trouvé");
        }

        try {
            String newAccessToken = authService.refreshToken(refreshToken);
            // Renvoyer le nouvel access token dans un cookie
            cookieUtil.create(response, accessTokenCookieName, newAccessToken, (int) (accessTokenExpirationMs / 1000), "/");
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body("Refresh token invalide: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = extractTokenFromCookie(request, accessTokenCookieName);
        String refreshToken = extractTokenFromCookie(request, refreshTokenCookieName);
        
        authService.logout(accessToken, refreshToken); // Gère la blacklist et la whitelist
        
        // Efface les cookies côté client
        cookieUtil.clear(response, accessTokenCookieName, "/");
        cookieUtil.clear(response, refreshTokenCookieName, "/api/auth/refresh"); // path spécifique
        
        return ResponseEntity.ok("Déconnecté");
    }

    // --- Endpoints OTP ---

    @PostMapping("/send-otp")
    @RateLimiter(name = "otpRateLimiter")
    @Operation(summary = "Envoyer un code OTP", description = "Envoie un code de vérification à 6 chiffres par email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Code OTP envoyé avec succès"),
        @ApiResponse(responseCode = "429", description = "Trop de demandes - veuillez patienter")
    })
    public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody OtpRequestDto request) {
        authService.sendOtpForRegistration(request.email());
        return ResponseEntity.ok(Map.of(
            "message", "Un code de vérification a été envoyé à votre adresse email",
            "email", request.email()
        ));
    }

    @PostMapping("/verify-otp")
    @RateLimiter(name = "otpRateLimiter")
    @Operation(summary = "Vérifier un code OTP", description = "Vérifie si le code OTP est valide")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Code OTP valide"),
        @ApiResponse(responseCode = "400", description = "Code OTP incorrect"),
        @ApiResponse(responseCode = "410", description = "Code OTP expiré")
    })
    public ResponseEntity<Map<String, String>> verifyOtp(@Valid @RequestBody OtpVerificationDto request) {
        authService.verifyOtp(request.email(), request.otp());
        return ResponseEntity.ok(Map.of("message", "Code de vérification valide"));
    }

    @PostMapping("/forgot-password")
    @RateLimiter(name = "otpRateLimiter")
    @Operation(summary = "Mot de passe oublié", description = "Envoie un code OTP pour réinitialiser le mot de passe")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Code OTP envoyé si l'email existe"),
        @ApiResponse(responseCode = "429", description = "Trop de demandes - veuillez patienter")
    })
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody OtpRequestDto request) {
        // On envoie toujours la même réponse pour ne pas révéler si l'email existe
        authService.sendOtpForPasswordReset(request.email());
        return ResponseEntity.ok(Map.of(
            "message", "Si un compte existe avec cet email, un code de vérification sera envoyé"
        ));
    }

    @PostMapping("/reset-password")
    @RateLimiter(name = "otpRateLimiter")
    @Operation(summary = "Réinitialiser le mot de passe", description = "Réinitialise le mot de passe avec un code OTP valide")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Mot de passe réinitialisé avec succès"),
        @ApiResponse(responseCode = "400", description = "Code OTP incorrect ou mots de passe non correspondants"),
        @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé"),
        @ApiResponse(responseCode = "410", description = "Code OTP expiré")
    })
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordDto request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Votre mot de passe a été réinitialisé avec succès"));
    }

    // Helper pour ajouter les cookies
    private void addTokensToCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        cookieUtil.create(response, accessTokenCookieName, accessToken, (int) (accessTokenExpirationMs / 1000), "/");
        cookieUtil.create(response, refreshTokenCookieName, refreshToken, (int) (refreshTokenExpirationMs / 1000), "/api/auth/refresh");
    }

    // Helper pour lire un cookie
    private String extractTokenFromCookie(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals(cookieName))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }
}