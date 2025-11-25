package com.cameroun_tour.tourisme.voyageur.auth.api;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cameroun_tour.tourisme.common.auth.JWTutils;
import com.cameroun_tour.tourisme.common.utils.enums.Role;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.api.UtilisateurRepository;
import com.cameroun_tour.tourisme.voyageur.auth.AuthentificationService;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurLoginDto; 
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurRegistrationDto;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.cameroun_tour.tourisme.voyageur.errors.EmailAlreadyExistsException;
import com.cameroun_tour.tourisme.voyageur.errors.UserNotFoundException; 

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Tag(name = "User Authentification Service", description = "Logique Métier de gestion de la connexion et l'inscription des utilisateurs")
public class AuthServiceImpl implements AuthentificationService{

    private final UtilisateurRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTutils jwtService;
    private final @Lazy AuthenticationManager authenticationManager;
    
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpirationMs;

    private String getRefreshWhitelistKey(String username) {
        return "refresh_tokens:" + username;
    }
    
    @Override
    @SuppressWarnings("null")
    @Transactional(rollbackFor = Exception.class)
    public AuthResult register(UtilisateurRegistrationDto request) {
        UtilisateurEntity savedUser; // On déclare une variable pour récupérer l'entité sauvegardée
        try {
            var user = UtilisateurEntity.builder()
                .nomComplet(request.nomComplet())
                .userEmail(request.email())
                .userPassword(passwordEncoder.encode(request.password()))
                .paysOrigine(request.paysOrigine())
                .photoProfile(request.photoProfile())
                .role(Role.USER)
                .build(); // publicId est généré automatiquement ici par le @Builder.Default de l'entité

            savedUser = userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new EmailAlreadyExistsException("Un utilisateur avec cet email existe déjà.");
        }

        // CORRECTION : On utilise la méthode de conversion qui inclut le publicId
        return generateAndStoreTokens(convertFromEntity(savedUser));
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResult login(UtilisateurLoginDto request) { 
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        var user = userRepository.findByUserEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        return generateAndStoreTokens(convertFromEntity(user));
    }

    @Override
    @SuppressWarnings("null")
    @Transactional(rollbackFor = Exception.class)
    public AuthResult processOAuth2User(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        if (email == null) {
            throw new IllegalArgumentException("Email introuvable dans le compte OAuth2");
        }
        
        UtilisateurEntity user = userRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    String name = oauth2User.getAttribute("name");
                    String picture = oauth2User.getAttribute("picture");
                    
                    UtilisateurEntity newUser = UtilisateurEntity.builder()
                            .userEmail(email)
                            .nomComplet(name != null ? name : "Utilisateur sans nom")
                            .photoProfile(picture)
                            .role(Role.USER)
                            .build();
                    return userRepository.save(newUser);
                }); 
        
        return generateAndStoreTokens(convertFromEntity(user));
    }

    @Override
    @SuppressWarnings("null")
    public String refreshToken(String refreshToken) {
        if (refreshToken == null || jwtService.isTokenInvalidated(refreshToken)) {
            throw new RuntimeException("Refresh token invalide ou blacklisté (1)");
        }
        
        String username = jwtService.extractUsername(refreshToken);
        UtilisateurEntity user = userRepository.findByUserEmail(username)
                 .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé"));

        // Vérifier si le token est dans notre whitelist Redis
        String redisKey = getRefreshWhitelistKey(user.getUsername());
        Boolean isTokenInWhitelist = redisTemplate.opsForSet().isMember(redisKey, refreshToken);

        if (Boolean.TRUE.equals(isTokenInWhitelist)) {
            // Token valide, on génère un nouvel access token
            return jwtService.generateToken(user.getUsername());
        } else {
            throw new RuntimeException("Refresh token invalide ou révoqué (2)");
        }
    }
    
    @Override
    @SuppressWarnings("null")
    public void logout(String accessToken, String refreshToken) {
        if (accessToken != null) {
            // 1. Mettre l'access token sur la blacklist
            jwtService.invalidateToken(accessToken);
        }
        if (refreshToken != null) {
            // 2. Mettre aussi le refresh token sur la blacklist (sécurité supplémentaire)
            jwtService.invalidateToken(refreshToken);
            
            // 3. Retirer le refresh token de la whitelist
            try {
                String username = jwtService.extractUsername(refreshToken);
                String redisKey = getRefreshWhitelistKey(username);
                redisTemplate.opsForSet().remove(redisKey, refreshToken);
            } catch (Exception e) {
                // Ignorer si le token était déjà expiré, etc.
                
            }
        }
    }

    /**
     * Helper pour générer les tokens et les stocker dans la whitelist Redis
     */
    @SuppressWarnings("null")
    private AuthResult generateAndStoreTokens(UtilisateurDto user) {
        String accessToken = jwtService.generateToken(user.email());
        String refreshToken = jwtService.generateRefreshToken(user.email());

        // Stocker le refresh token dans la whitelist (Set)
        String redisKey = getRefreshWhitelistKey(user.email());
        redisTemplate.opsForSet().add(redisKey, refreshToken);
        // Définir une expiration sur le Set lui-même (un peu plus long que le token)
        redisTemplate.expire(redisKey, refreshTokenExpirationMs + 60000, TimeUnit.MILLISECONDS);

        return new AuthResult(user, accessToken, refreshToken);
    }

    @Override
    public UtilisateurDto convertFromEntity(UtilisateurEntity user){
        var userProfile = UtilisateurDto.builder()
                                        .publicId(user.getPublicId())
                                        .nomComplet(user.getNomComplet())
                                        .email(user.getUserEmail())
                                        .paysOrigine(user.getPaysOrigine())
                                        .photoProfile(user.getPhotoProfile())
                                        .build();
        return userProfile;
    }
}