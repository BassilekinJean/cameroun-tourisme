package com.cameroun_tour.tourisme.etablissement.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour les résultats de recherche
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult {

    private List<EtablissementListItem> etablissements;
    private long totalResults;
    private int page;
    private int totalPages;

}
