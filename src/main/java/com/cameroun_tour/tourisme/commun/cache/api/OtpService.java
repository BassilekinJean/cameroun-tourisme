package com.cameroun_tour.tourisme.commun.cache.api;

public interface OtpService {

    String generateOtp();

    void saveOtp(String email, String otp);

    boolean isOtpValid(String email, String otp);

}
