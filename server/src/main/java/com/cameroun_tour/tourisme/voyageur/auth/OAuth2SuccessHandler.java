package com.cameroun_tour.tourisme.voyageur.auth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.cameroun_tour.tourisme.common.auth.CookieUtil;
import com.cameroun_tour.tourisme.common.auth.Oauth2AuthenticationSuccessHandler;
import com.cameroun_tour.tourisme.voyageur.auth.api.AuthServiceImpl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler implements Oauth2AuthenticationSuccessHandler{

    private final @Lazy AuthentificationService authService;
    private final CookieUtil cookieUtil;

    @Value("${app.oauth2.redirect-uri}") private String redirectUri;
    @Value("${jwt.access-token.cookie-name}") private String accessTokenCookieName;
    @Value("${jwt.refresh-token.cookie-name}") private String refreshTokenCookieName;
    @Value("${jwt.access-token-expiration}") private long accessTokenExpirationMs;
    @Value("${jwt.refresh-token-expiration}") private long refreshTokenExpirationMs;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        
        // 1. Traiter l'utilisateur et générer nos tokens
        AuthServiceImpl.AuthResult result = authService.processOAuth2User(oauth2User);
        
        // 2. Ajouter les tokens aux cookies (HttpOnly)
        cookieUtil.create(response, accessTokenCookieName, result.accessToken(), (int) (accessTokenExpirationMs / 1000), "/");
        cookieUtil.create(response, refreshTokenCookieName, result.refreshToken(), (int) (refreshTokenExpirationMs / 1000), "/api/auth/refresh");

        // 3. Rediriger vers React (sans token dans l'URL)
        getRedirectStrategy().sendRedirect(request, response, redirectUri);
    }
}