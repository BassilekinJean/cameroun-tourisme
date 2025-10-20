package com.cameroun_tour.tourisme.voyageur.errors;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExceptionEntity {

    private String message;

    private String uri;

    private LocalDateTime timestamp;
}
