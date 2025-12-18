package com.cameroun_tour.tourisme.common.cache;

import org.springframework.lang.NonNull;

public interface OtpServiceApi {
    String generateOtp();
    void saveOtp(@NonNull String email, @NonNull String otp);
    
    /**
     * Valide un code OTP pour un email donné.
     * @param email L'email associé au code OTP
     * @param otp Le code OTP à valider
     * @throws com.cameroun_tour.tourisme.voyageur.errors.OtpExpiredException si le code a expiré ou n'existe pas
     * @throws com.cameroun_tour.tourisme.voyageur.errors.OtpInvalidException si le code est incorrect
     */
    void validateOtp(@NonNull String email, @NonNull String otp);
    
    /**
     * @deprecated Utiliser validateOtp() à la place qui lève des exceptions spécifiques
     */
    @Deprecated
    boolean isOtpValid(@NonNull String email, @NonNull String otp);
}
