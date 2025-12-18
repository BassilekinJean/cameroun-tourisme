package com.cameroun_tour.tourisme.voyageur.errors;

public class AccountLockedException extends RuntimeException {
    public AccountLockedException(String message) {
        super(message);
    }
}
