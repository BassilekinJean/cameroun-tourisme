package com.cameroun_tour.tourisme.voyageur.errors;


public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }

}
