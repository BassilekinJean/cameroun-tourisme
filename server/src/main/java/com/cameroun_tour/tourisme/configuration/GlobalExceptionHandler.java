package com.cameroun_tour.tourisme.configuration;


import java.util.stream.Collectors;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.cameroun_tour.tourisme.common.utils.ApiErrorResponse;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
@Order(Ordered.LOWEST_PRECEDENCE)
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.BAD_REQUEST.value(), details, "Validation Error");
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.FORBIDDEN.value(), "Accès refusé", "Forbidden");
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.NOT_FOUND.value(), "Ressource non trouvée", "Not Found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(MailException.class)
    public ResponseEntity<ApiErrorResponse> handleMailException(MailException ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.SERVICE_UNAVAILABLE.value(), "Erreur d'envoi de mail", "Service Unavailable");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    @ExceptionHandler(RedisConnectionFailureException.class)
    public ResponseEntity<ApiErrorResponse> handleRedisException(RedisConnectionFailureException ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.SERVICE_UNAVAILABLE.value(), "Redis indisponible", "Service Unavailable");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<ApiErrorResponse> handleBadRequest(RuntimeException ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), "Bad Request");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthentication(AuthenticationException ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Authentification requise", "Unauthorized");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {    
        ApiErrorResponse body = new ApiErrorResponse(
            HttpStatus.CONFLICT.value(), 
            "Une contrainte de base de données a été violée", 
            "Data Integrity Violation"
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex) {
        log.error("Unhandled exception occurred", ex);
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Une erreur interne est survenue.", "Internal Server Error");
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
