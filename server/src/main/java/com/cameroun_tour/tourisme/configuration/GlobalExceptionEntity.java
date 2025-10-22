package com.cameroun_tour.tourisme.configuration;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GlobalExceptionEntity {

    private String message;

    private int code;

    private LocalDateTime timestamp;
}
