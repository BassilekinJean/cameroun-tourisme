package com.cameroun_tour.tourisme.etablissement.errors;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.cameroun_tour.tourisme.common.utils.ApiErrorResponse;

@RestControllerAdvice(basePackages = "com.cameroun_tour.tourisme.etablissement")
@Order(Ordered.HIGHEST_PRECEDENCE)
public class LieuExceptionHandler {

    @ExceptionHandler(LieuNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleLieuNotFoundException(LieuNotFoundException ex) {
        ApiErrorResponse erreur = new ApiErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage(), "Aucun lieu trouvé");
        return new ResponseEntity<>(erreur, HttpStatus.NOT_FOUND);
    }

}
