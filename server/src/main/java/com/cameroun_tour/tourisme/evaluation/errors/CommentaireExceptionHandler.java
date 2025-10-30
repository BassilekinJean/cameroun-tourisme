package com.cameroun_tour.tourisme.evaluation.errors;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.cameroun_tour.tourisme.common.utils.ApiErrorResponse;

@RestControllerAdvice(basePackages = "com.cameroun_tour.tourisme.evaluation")
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CommentaireExceptionHandler {

    @ExceptionHandler(CommentNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handlerCommentNotFound(CommentNotFoundException ex){
        ApiErrorResponse body = new ApiErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage(), "Commentaire Introuvable");
        return new ResponseEntity<>(body,HttpStatus.NOT_FOUND);
    }
}
