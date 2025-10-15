package com.cameroun_tour.tourisme.commun.cache.service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.cameroun_tour.tourisme.commun.cache.api.OtpServiceApi;

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
    public void saveOtp(String email, String otp) {
        redisTemplate.opsForValue().set(email, otp, expirationTime, TimeUnit.MILLISECONDS);
    }

    private String getOtp(String email) {
        return (String) redisTemplate.opsForValue().get(email);
    }

    private void deleteOtp(String email) {
        redisTemplate.delete(email);
    }

    @Override
    public boolean isOtpValid(String email, String otp) {
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
