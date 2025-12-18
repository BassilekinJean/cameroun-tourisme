package com.cameroun_tour.tourisme.common.events;

import java.time.LocalDate;

public record AvisPublieEvent(
    String auteurEmail,
    String message,
    Long lieuId,
    int note,
    LocalDate datePublication 
) {}