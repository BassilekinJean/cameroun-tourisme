package com.cameroun_tour.tourisme.voyageur.errors;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionEntity> ExceptionHandler(Exception ex, WebRequest rq){
        ExceptionEntity exceptionEntity = new ExceptionEntity(
            ex.getMessage(),
            rq.getDescription(false),
            LocalDateTime.now()
        );
        return ResponseEntity.ok(exceptionEntity);
    }


}
