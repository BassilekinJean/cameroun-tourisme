package com.cameroun_tour.tourisme.commun.email.api;

public interface EmailServiceApi {
    void sendMessage(String destinataire, String subject, String body);
    void sendOtp(String email);
}
