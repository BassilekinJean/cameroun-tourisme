package com.cameroun_tour.tourisme.voyageur.errors;

/**
 * Exception levée lorsqu'un code OTP a expiré.
 */
public class OtpExpiredException extends RuntimeException {
    public OtpExpiredException(String message) {
        super(message);
    }
}
