package com.cameroun_tour.tourisme.commun.email.api;

public interface EmailService {

    void sendMessage(String destinataire, String subject, String body);

    void sendOtp(String email);

}
