package com.cameroun_tour.tourisme.voyageur.errors;


import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.cameroun_tour.tourisme.common.utils.ApiErrorResponse;

import io.github.resilience4j.ratelimiter.RequestNotPermitted;


@RestControllerAdvice(basePackages = "com.cameroun_tour.tourisme.voyageur")
@Order(Ordered.HIGHEST_PRECEDENCE)
public class VoyageurExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage(), "Not Found");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.CONFLICT.value(), ex.getMessage(), "Conflict, Email Already Exists");
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(RequestNotPermitted.class)
    public ResponseEntity<ApiErrorResponse> handleRateLimitException(RequestNotPermitted ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.TOO_MANY_REQUESTS.value(), ex.getMessage(), "Too Many Requests");
        return new ResponseEntity<>(body, HttpStatus.TOO_MANY_REQUESTS);
    }

    @ExceptionHandler(VoyageurBadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(VoyageurBadCredentialsException ex) {
        // 401 Unauthorized 
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.UNAUTHORIZED.value(), ex.getMessage(), "Authentication Failed");
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<ApiErrorResponse> handleLocked(AccountLockedException ex) {
        // 423 Locked est le code HTTP 
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.LOCKED.value(), ex.getMessage(), "Account Locked");
        return new ResponseEntity<>(body, HttpStatus.LOCKED);
    }

    @ExceptionHandler(OtpInvalidException.class)
    public ResponseEntity<ApiErrorResponse> handleOtpInvalid(OtpInvalidException ex) {
        // 400 Bad Request - Code OTP incorrect
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), "OTP_INVALID");
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(OtpExpiredException.class)
    public ResponseEntity<ApiErrorResponse> handleOtpExpired(OtpExpiredException ex) {
        // 410 Gone - Code OTP expiré
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.GONE.value(), ex.getMessage(), "OTP_EXPIRED");
        return new ResponseEntity<>(body, HttpStatus.GONE);
    }
}
