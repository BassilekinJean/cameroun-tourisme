package com.cameroun_tour.tourisme.voyageur.errors;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class VoyageurExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) // 404
    public ResponseEntity<ErreurResponse> UserNotFoundExceptionHandler(UserNotFoundException ex){

        ErreurResponse exceptionEntity = new ErreurResponse();
        exceptionEntity.setMessage(ex.getMessage());
        exceptionEntity.setError("User Not Found");
        exceptionEntity.setCode(HttpStatus.NOT_FOUND.value());
        exceptionEntity.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(exceptionEntity, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // 500
    public ErreurResponse handleGenericError(Exception ex) {
        ErreurResponse exceptionEntity = new ErreurResponse();
        exceptionEntity.setTimestamp(LocalDateTime.now());
        exceptionEntity.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        exceptionEntity.setError("Erreur interne du serveur");
        exceptionEntity.setMessage("Une erreur inattendue est survenue.");
        
        return exceptionEntity;
    }

}
