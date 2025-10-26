package com.cameroun_tour.tourisme.voyageur.errors;


import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.cameroun_tour.tourisme.common.utils.ApiErrorResponse;


@RestControllerAdvice(basePackages = "com.cameroun_tour.tourisme.voyageur.api")
@Order(Ordered.HIGHEST_PRECEDENCE)
public class VoyageurExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage(), "Not Found");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.CONFLICT.value(), ex.getMessage(), "Conflict");
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }


}
