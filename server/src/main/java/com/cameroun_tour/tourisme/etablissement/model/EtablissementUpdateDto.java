package com.cameroun_tour.tourisme.etablissement.model;

import java.util.List;

public record EtablissementUpdateDto(
    String description,
    String telephone,
    String photoProfile,
    String adresse,
    List<String> images,
    Double latitude,
    Double longitude
) {}
