package com.cameroun_tour.tourisme.common.cache.service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.cameroun_tour.tourisme.common.cache.OtpServiceApi;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OtpService implements OtpServiceApi {

    private long expirationTime = 5 * 60 * 1000; // 5 minutes en millisecondes

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public String generateOtp(){
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    @Override
    public void saveOtp(@NonNull String email, @NonNull String otp) {
        redisTemplate.opsForValue().set(email, otp, expirationTime, TimeUnit.MILLISECONDS);
    }

    private String getOtp(@NonNull String email) {
        return (String) redisTemplate.opsForValue().get(email);
    }

    private void deleteOtp(@NonNull String email) {
        redisTemplate.delete(email);
    }

    @Override
    public void validateOtp(@NonNull String email, @NonNull String otp) {
        String storedOtp = getOtp(email);
        
        // Vérifier si le code OTP existe
        if (storedOtp == null) {
            throw new OtpExpiredException("Le code de vérification a expiré ou n'existe pas. Veuillez demander un nouveau code.");
        }
        
        // Vérifier l'expiration
        Long expiration = redisTemplate.getExpire(email, TimeUnit.MILLISECONDS);
        if (expiration == null || expiration <= 0) {
            deleteOtp(email); // Nettoyer le code expiré
            throw new OtpExpiredException("Le code de vérification a expiré. Veuillez demander un nouveau code.");
        }
        
        // Vérifier si le code est correct
        if (!storedOtp.equals(otp)) {
            throw new OtpInvalidException("Le code de vérification est incorrect. Veuillez vérifier et réessayer.");
        }
        
        // Code valide, on le supprime pour éviter sa réutilisation
        deleteOtp(email);
    }

    @Override
    @Deprecated
    public boolean isOtpValid(@NonNull String email, @NonNull String otp) {
        String storedOtp = getOtp(email);
        long expiration = redisTemplate.getExpire(email, TimeUnit.MILLISECONDS);
        if (storedOtp == null || expiration <= 0) {
            return false; //Le code OTP n'existe pas ou à expirer 
        }
        if (storedOtp.equals(otp)) {
            deleteOtp(email);
            return true; // Le code est valide
        }
        return false;
    }
}
