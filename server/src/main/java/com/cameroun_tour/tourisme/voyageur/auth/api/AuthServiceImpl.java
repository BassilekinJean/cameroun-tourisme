package com.cameroun_tour.tourisme.voyageur.auth.api;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cameroun_tour.tourisme.common.auth.JWTutils;
import com.cameroun_tour.tourisme.common.cache.OtpServiceApi;
import com.cameroun_tour.tourisme.common.email.EmailServiceApi;
import com.cameroun_tour.tourisme.common.utils.enums.Role;
import com.cameroun_tour.tourisme.voyageur.UtilisateurEntity;
import com.cameroun_tour.tourisme.voyageur.api.UtilisateurRepository;
import com.cameroun_tour.tourisme.voyageur.auth.AuthentificationService;
import com.cameroun_tour.tourisme.voyageur.errors.AccountLockedException;
import com.cameroun_tour.tourisme.voyageur.errors.EmailAlreadyExistsException;
import com.cameroun_tour.tourisme.voyageur.errors.UserNotFoundException;
import com.cameroun_tour.tourisme.voyageur.errors.VoyageurBadCredentialsException;
import com.cameroun_tour.tourisme.voyageur.model.ResetPasswordDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurLoginDto;
import com.cameroun_tour.tourisme.voyageur.model.UtilisateurRegistrationDto;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Tag(name = "User Authentification Service", description = "Logique Métier de gestion de la connexion et l'inscription des utilisateurs")
public class AuthServiceImpl implements AuthentificationService {

    private final UtilisateurRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTutils jwtService;
    private final @Lazy AuthenticationManager authenticationManager;
    private final EmailServiceApi emailService;
    private final OtpServiceApi otpService;
    
    private final RedisTemplate<String, Object> redisTemplate;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION_HOURS = 2;

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
    @Transactional(noRollbackFor = {VoyageurBadCredentialsException.class, BadCredentialsException.class})
    public AuthResult login(UtilisateurLoginDto request) { 
        // Ce service gère uniquement l'authentification des voyageurs
        UtilisateurEntity user = userRepository.findByUserEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("Voyageur non trouvé avec cet email"));

        // 1. Vérifier si le compte est verrouillé
        if (user.isAccountLocked()) {
            if (!unlockWhenTimeExpired(user)) {
                throw new AccountLockedException("Votre compte est verrouillé. Réessayez dans 2 heures.");
            }
        }

        try {
            // 2. Tenter l'authentification
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
            
            // 3. SUCCÈS : Réinitialiser les compteurs
            if (user.getFailedAttempt() > 0) {
                resetFailedAttempts(user);
            }
            return generateAndStoreTokens(convertFromEntity(user));

        } catch (BadCredentialsException e) {
            // 4. ÉCHEC : Incrémenter les tentatives
            increaseFailedAttempts(user);
            throw new VoyageurBadCredentialsException("Email ou mot de passe incorrect");
        } catch (LockedException e) {
            throw new AccountLockedException("Votre compte est verrouillé.");
        }
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
    @Transactional(readOnly = true)
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

    // --- Méthodes Helper d'Authentification---

    private void increaseFailedAttempts(UtilisateurEntity user) {
        int newFailAttempts = user.getFailedAttempt() + 1;
        user.setFailedAttempt(newFailAttempts);
        
        if (newFailAttempts >= MAX_FAILED_ATTEMPTS) {
            lockUserAccount(user);
        }
        userRepository.save(user);
    }

    private void resetFailedAttempts(UtilisateurEntity user) {
        user.setFailedAttempt(0);
        user.setAccountLocked(false);
        user.setLockTime(null);
        userRepository.save(user);
    }

    private void lockUserAccount(UtilisateurEntity user) {
        user.setAccountLocked(true);
        user.setLockTime(LocalDateTime.now());
    }

    private boolean unlockWhenTimeExpired(UtilisateurEntity user) {
        if (user.getLockTime().plusHours(LOCK_TIME_DURATION_HOURS).isBefore(LocalDateTime.now())) {
            user.setAccountLocked(false);
            user.setLockTime(null);
            user.setFailedAttempt(0);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    // --- Conversion Entity <-> DTO ---
    @Override
    public UtilisateurDto convertFromEntity(UtilisateurEntity user){
       return new UtilisateurDto(
            user.getPublicId(),
            user.getNomComplet(),
            user.getUserEmail(),
            user.getPaysOrigine(),
            user.getPhotoProfile(),
            user.getFavorisIds() != null ? new java.util.HashSet<>(user.getFavorisIds()) : new java.util.HashSet<>(), // Directement les UUIDs, plus de mapping nécessaire
            user.getRole() // Ajouter le rôle pour l'affichage du panel admin/établissement
        );
    }

    // --- Méthodes OTP ---
    
    @Override
    public void sendOtpForRegistration(String email) {
        // Vérifier que l'email n'est pas déjà utilisé
        if (userRepository.findByUserEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Un compte avec cet email existe déjà");
        }
        // Envoyer le code OTP par email
        emailService.sendOtp(email);
    }
    
    @Override
    public void sendOtpForPasswordReset(String email) {
        // Vérifier que l'email existe
        if (userRepository.findByUserEmail(email).isEmpty()) {
            // On ne révèle pas que l'email n'existe pas pour des raisons de sécurité
            // On log juste et on ne fait rien
            return;
        }
        // Envoyer le code OTP par email
        emailService.sendOtp(email);
    }
    
    @Override
    @SuppressWarnings("null")
    public void verifyOtp(String email, String otp) {
        // Valide le code OTP - lève OtpExpiredException ou OtpInvalidException si erreur
        otpService.validateOtp(email, otp);
    }
    
    @Override
    @Transactional
    @SuppressWarnings("null")
    public void resetPassword(ResetPasswordDto request) {
        // 1. Vérifier que les mots de passe correspondent
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas");
        }
        
        // 2. Valider le code OTP - lève une exception si invalide ou expiré
        otpService.validateOtp(request.email(), request.otp());
        
        // 3. Trouver l'utilisateur
        UtilisateurEntity user = userRepository.findByUserEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("Aucun compte associé à cet email"));
        
        // 4. Mettre à jour le mot de passe
        user.setUserPassword(passwordEncoder.encode(request.newPassword()));
        
        // 5. Réinitialiser les tentatives de connexion échouées si le compte était verrouillé
        if (user.isAccountLocked()) {
            user.setAccountLocked(false);
            user.setLockTime(null);
            user.setFailedAttempt(0);
        }
        
        userRepository.save(user);
    }
}