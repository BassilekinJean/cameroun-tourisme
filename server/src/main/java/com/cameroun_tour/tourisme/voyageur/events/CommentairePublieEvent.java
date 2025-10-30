package com.cameroun_tour.tourisme.voyageur.events;

import java.time.LocalDateTime;

public record CommentairePublieEvent(
    String auteurEmail,
    String message,
    int note,
    LocalDateTime datePublication 
) {}