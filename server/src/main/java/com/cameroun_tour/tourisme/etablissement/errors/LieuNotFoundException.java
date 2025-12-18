package com.cameroun_tour.tourisme.etablissement.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class LieuNotFoundException extends RuntimeException {

    public LieuNotFoundException(String message) {
        super(message);
    }

}
