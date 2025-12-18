package com.cameroun_tour.tourisme.admin.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long totalEtablissements;
    private long totalAvis;
    private long totalHotels;
    private long totalRestaurants;
    private long totalSitesTouristiques;
}
