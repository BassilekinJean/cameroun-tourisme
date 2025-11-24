package com.cameroun_tour.tourisme.common.cache;

import org.springframework.lang.NonNull;

public interface OtpServiceApi {
    String generateOtp();
    void saveOtp(@NonNull String email, @NonNull String otp);
    boolean isOtpValid(@NonNull String email, @NonNull String otp);
}
