package com.cameroun_tour.tourisme.common.cache.api;

public interface OtpServiceApi {
    String generateOtp();
    void saveOtp(String email, String otp);
    boolean isOtpValid(String email, String otp);
}
