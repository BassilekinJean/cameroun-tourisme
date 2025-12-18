package com.cameroun_tour.tourisme.voyageur.errors;

import java.util.UUID;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException {
    
    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(UUID publicId) {
        super(String.format("Utilisateur non trouvé avec l'identifiant: %s", publicId));
    }

    public UserNotFoundException(String field, String value) {
        super(String.format("Utilisateur non trouvé avec %s: %s", field, value));
    }
}
