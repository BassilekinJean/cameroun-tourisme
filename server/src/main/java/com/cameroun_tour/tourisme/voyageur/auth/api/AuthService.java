package com.cameroun_tour.tourisme.voyageur.auth.api;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;
    
    // Structure pour renvoyer l'utilisateur ET les tokens
    public record AuthResult(UtilisateurEntity user, String accessToken, String refreshToken) {}

    public AuthResult register(RegisterRequest request) {
        var user = UtilisateurEntity.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        
        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiry(Instant.now().plusMillis(refreshTokenExpiration));
        userRepository.save(user);

        return new AuthResult(user, accessToken, refreshToken);
    }

    public AuthResult login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        
        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiry(Instant.now().plusMillis(refreshTokenExpiration));
        userRepository.save(user);

        return new AuthResult(user, accessToken, refreshToken);
    }

    public AuthResult processOAuth2User(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // Inscription automatique pour Google
                    User newUser = User.builder()
                            .email(email)
                            .firstname(oauth2User.getAttribute("given_name"))
                            .lastname(oauth2User.getAttribute("family_name"))
                            .role(Role.USER)
                            .build();
                    return userRepository.save(newUser);
                });
        
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiry(Instant.now().plusMillis(refreshTokenExpiration));
        userRepository.save(user);

        return new AuthResult(user, accessToken, refreshToken);
    }

    // NOUVELLE MÉTHODE: Refresh
    public String refreshToken(String refreshToken) {
        return userRepository.findByRefreshToken(refreshToken) // (Vous devez créer cette méthode dans le Repo)
            .filter(user -> user.getRefreshTokenExpiry().isAfter(Instant.now()))
            .map(user -> {
                // Refresh token valide, on génère un nouvel access token
                return jwtService.generateAccessToken(user);
            })
            .orElseThrow(() -> new RuntimeException("Refresh token invalide ou expiré"));
    }
    
    // NOUVELLE MÉTHODE: Logout
    public void logout(String refreshToken) {
         userRepository.findByRefreshToken(refreshToken)
            .ifPresent(user -> {
                user.setRefreshToken(null);
                user.setRefreshTokenExpiry(null);
                userRepository.save(user);
            });
    }
}
