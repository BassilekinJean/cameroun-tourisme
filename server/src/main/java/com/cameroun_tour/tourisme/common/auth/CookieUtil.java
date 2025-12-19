package com.cameroun_tour.tourisme.common.auth;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    // Crée un cookie HttpOnly sécurisé avec SameSite
    public void create(HttpServletResponse response, String name, String value, int maxAgeInSeconds, String path) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .maxAge(maxAgeInSeconds)
                .path(path)
                .sameSite("Lax") // Lax pour le développement local
                // .secure(true) // À activer en production (HTTPS)
                .build();
        
        response.addHeader("Set-Cookie", cookie.toString());
    }

    // Efface un cookie
    public void clear(HttpServletResponse response, String name, String path) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .maxAge(0)
                .path(path)
                .sameSite("Lax")
                .build();
        
        response.addHeader("Set-Cookie", cookie.toString());
    }
}