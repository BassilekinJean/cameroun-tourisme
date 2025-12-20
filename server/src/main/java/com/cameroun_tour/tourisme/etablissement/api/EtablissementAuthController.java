package com.cameroun_tour.tourisme.etablissement.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cameroun_tour.tourisme.common.auth.CookieUtil;
import com.cameroun_tour.tourisme.common.auth.JWTutils;
import com.cameroun_tour.tourisme.etablissement.Etablissement;
import com.cameroun_tour.tourisme.etablissement.model.EtablissementAuthDto;
import com.cameroun_tour.tourisme.etablissement.model.EtablissementLoginDto;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Contrôleur d'authentification pour les établissements
 */
@RestController
@RequestMapping("/api/auth/etablissement")
@RequiredArgsConstructor
@Tag(name = "Authentification Établissement", description = "Endpoints pour l'authentification des établissements")
public class EtablissementAuthController {

    private final EtablissementRepository etablissementRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTutils jwtService;
    private final CookieUtil cookieUtil;

    @Value("${jwt.access-token.cookie-name}")
    private String accessTokenCookieName;
    
    @Value("${jwt.refresh-token.cookie-name}")
    private String refreshTokenCookieName;
    
    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpirationMs;
    
    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpirationMs;

    @PostMapping("/login")
    @RateLimiter(name = "loginRateLimiter")
    @Operation(summary = "Connexion établissement", description = "Authentifie un établissement avec email et mot de passe")
    public ResponseEntity<EtablissementAuthDto> login(
            @Valid @RequestBody EtablissementLoginDto request,
            HttpServletResponse response) {
        
        // Vérifier que l'établissement existe
        Etablissement etablissement = etablissementRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe incorrect"));
        
        try {
            // Tenter l'authentification via Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
            
            // Générer les tokens JWT
            String accessToken = jwtService.generateToken(etablissement.getEmail());
            String refreshToken = jwtService.generateRefreshToken(etablissement.getEmail());
            
            // Ajouter les tokens dans les cookies
            cookieUtil.create(response, accessTokenCookieName, accessToken, 
                    (int) (accessTokenExpirationMs / 1000), "/");
            cookieUtil.create(response, refreshTokenCookieName, refreshToken, 
                    (int) (refreshTokenExpirationMs / 1000), "/api/auth/refresh");
            
            // Retourner les informations de l'établissement
            return ResponseEntity.ok(EtablissementAuthDto.fromEntity(etablissement));
            
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Email ou mot de passe incorrect");
        }
    }
}
