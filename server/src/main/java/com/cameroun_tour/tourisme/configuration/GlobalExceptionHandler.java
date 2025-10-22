package com.cameroun_tour.tourisme.configuration;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.persistence.EntityNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

       @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<GlobalExceptionEntity> handleEntityNotFound(EntityNotFoundException ex) {
        GlobalExceptionEntity body = new GlobalExceptionEntity(ex.getMessage(), HttpStatus.NOT_FOUND.value(), LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<GlobalExceptionEntity> handleDataIntegrity(DataIntegrityViolationException ex) {
        GlobalExceptionEntity body = new GlobalExceptionEntity("Contrainte de base de données violée", HttpStatus.CONFLICT.value(), LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(MailException.class)
    public ResponseEntity<GlobalExceptionEntity> handleMailException(MailException ex) {
        GlobalExceptionEntity body = new GlobalExceptionEntity("Erreur d'envoi de mail", HttpStatus.SERVICE_UNAVAILABLE.value(), LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    @ExceptionHandler(RedisConnectionFailureException.class)
    public ResponseEntity<GlobalExceptionEntity> handleRedisException(RedisConnectionFailureException ex) {
        GlobalExceptionEntity body = new GlobalExceptionEntity("Redis indisponible", HttpStatus.SERVICE_UNAVAILABLE.value(), LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<GlobalExceptionEntity> handleBadRequest(RuntimeException ex) {
        GlobalExceptionEntity body = new GlobalExceptionEntity(ex.getMessage(), HttpStatus.BAD_REQUEST.value(), LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<GlobalExceptionEntity> handleAccessDenied(AccessDeniedException ex) {
        GlobalExceptionEntity body = new GlobalExceptionEntity("Accès refusé", HttpStatus.FORBIDDEN.value(), LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<GlobalExceptionEntity> handleAuthentication(AuthenticationException ex) {
        GlobalExceptionEntity body = new GlobalExceptionEntity("Authentification requise", HttpStatus.UNAUTHORIZED.value(), LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }
}
