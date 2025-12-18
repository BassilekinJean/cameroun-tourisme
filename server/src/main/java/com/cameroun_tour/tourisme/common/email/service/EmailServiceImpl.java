package com.cameroun_tour.tourisme.common.email.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.cameroun_tour.tourisme.common.cache.OtpServiceApi;
import com.cameroun_tour.tourisme.common.email.EmailServiceApi;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailServiceApi {

    private final OtpServiceApi otpService;
    private final JavaMailSender javaMailSender;

    @Override
    public void sendMessage(String destinataire, String subject, String body){
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message,true);
            if (destinataire != null) {
                helper.setTo(destinataire);
            }
            if (subject != null) {
                helper.setSubject(subject);
            }
            if(body != null){
                helper.setText(body, true);
            } 
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            e.getMessage();
            throw new RuntimeException("Erreur lors de l'envoi du Mail "+e);
        }
    }
    
    @Override
    public void sendOtp(String email){
        String subject = "Vérification de votre Email";
        String otpCode = otpService.generateOtp();
        String htmlTemplate = null;

        try (InputStream is = getClass().getClassLoader().getResourceAsStream("otp_email.html")) {
            if (is == null) {
                throw new RuntimeException("Le fichier otp_email.html est introuvable dans les ressources");
            }
            htmlTemplate = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (htmlTemplate == null) {
            throw new RuntimeException("Le fichier otp_mail.html est null");
        }
        String emailContent = htmlTemplate.replace("[OTP_CODE]", otpCode);

        sendMessage(email, subject, emailContent);

        if (otpCode != null && email != null) {
            otpService.saveOtp(email, otpCode);
        }
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        return ((EmailServiceApi) otpService).verifyOtp(email, otp);
    }
}
