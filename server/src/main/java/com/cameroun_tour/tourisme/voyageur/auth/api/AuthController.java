package com.cameroun_tour.tourisme.voyageur.auth.api;


import com.cameroun_tour.tourisme.common.auth.CookieUtil;
import com.cameroun_tour.tourisme.voyageur.auth.AuthentificationService;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurLoginDto; 
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurRegistrationDto;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthentificationService authService;
    private final CookieUtil cookieUtil;

    @Value("${jwt.access-token.cookie-name}") private String accessTokenCookieName;
    @Value("${jwt.refresh-token.cookie-name}") private String refreshTokenCookieName;
    @Value("${jwt.access-token-expiration}") private long accessTokenExpirationMs;
    @Value("${jwt.refresh-token-expiration}") private long refreshTokenExpirationMs;


    @PostMapping("/register")
    public ResponseEntity<UtilisateurDto> register(
            @Valid @RequestBody UtilisateurRegistrationDto request, 
            HttpServletResponse response
    ) {
        AuthServiceImpl.AuthResult result = authService.register(request);
        addTokensToCookies(response, result.accessToken(), result.refreshToken());
        
        return ResponseEntity.ok(result.user());
    }

    @PostMapping("/login")
    public ResponseEntity<UtilisateurDto> login(
            @Valid @RequestBody UtilisateurLoginDto request,
            HttpServletResponse response
    ) {
        AuthServiceImpl.AuthResult result = authService.login(request);
        addTokensToCookies(response, result.accessToken(), result.refreshToken());
        
        return ResponseEntity.ok(result.user());
    }

    @PostMapping("/refresh")
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