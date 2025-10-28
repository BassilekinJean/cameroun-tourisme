package com.cameroun_tour.tourisme.common.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    // Crée un cookie HttpOnly sécurisé
    public void create(HttpServletResponse response, String name, String value, int maxAgeInSeconds, String path) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true); // JavaScript ne peut pas y accéder
        cookie.setMaxAge(maxAgeInSeconds);
        cookie.setPath(path); // Le path est important !
        // cookie.setSecure(true); // À activer en production (HTTPS)
        // cookie.setSameSite("Strict"); // Pour la protection CSRF
        response.addCookie(cookie);
    }

    // Efface un cookie
    public void clear(HttpServletResponse response, String name, String path) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0); // Expire immédiatement
        cookie.setPath(path);
        response.addCookie(cookie);
    }
}