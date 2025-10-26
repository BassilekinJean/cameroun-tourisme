package com.cameroun_tour.tourisme.common.utils;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ApiErrorResponse {

    private int status;
    private String message;
    private String error; // Ex: "Not Found", "Bad Request"
    private final LocalDateTime timestamp;

    public ApiErrorResponse(int status, String message, String error) {
        this.status = status;
        this.message = message;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }
}