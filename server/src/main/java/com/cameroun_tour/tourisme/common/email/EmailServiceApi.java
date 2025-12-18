package com.cameroun_tour.tourisme.common.email;



public interface EmailServiceApi {
    void sendMessage(String destinataire, String subject, String body);
    void sendOtp(String email);
    boolean verifyOtp(String email, String otp);
}
