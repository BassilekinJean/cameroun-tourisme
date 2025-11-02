package com.cameroun_tour.tourisme.common.events;

import java.time.LocalDateTime;

public record CommentairePublieEvent(
    String auteurEmail,
    String message,
    Long lieuId,
    int note,
    LocalDateTime datePublication 
) {}